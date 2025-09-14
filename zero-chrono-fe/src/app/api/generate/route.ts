import { NextRequest, NextResponse } from 'next/server';
import { createCerebrasClient } from '@/lib/cerebras';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, csv_content, csv_delimiter = ',', csv_max_rows = 1000, rag_columns = '*', rag_max_chars = 4000 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing 'prompt' in request body" }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();
    
    // Build CSV context if provided
    let csvContext = '';
    if (csv_content) {
      try {
        csvContext = buildCsvContext(csv_content, csv_delimiter, csv_max_rows, rag_columns, rag_max_chars);
      } catch (error) {
        return NextResponse.json({ error: `Failed to process CSV content: ${error}` }, { status: 400 });
      }
    }

    const userContent = csvContext ? `${csvContext}${prompt}` : prompt;

    const result = await cerebrasClient.generateSingleCompletion(userContent, {
      temperature: 0.7,
      maxTokens: 4096,
    });

    return NextResponse.json({
      content: result.content,
      model: result.model,
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

function buildCsvContext(
  csvText: string,
  delimiter: string,
  maxRows: number,
  ragColumns: string,
  maxChars: number
): string {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return '';

  const header = lines[0].split(delimiter).map(col => col.trim());
  const rows = lines.slice(1, maxRows + 1).map(line => 
    line.split(delimiter).map(cell => cell.trim())
  );

  // Select columns
  let columnIndices: number[];
  if (ragColumns === '*') {
    columnIndices = Array.from({ length: header.length }, (_, i) => i);
  } else {
    const requestedColumns = ragColumns.split(',').map(col => col.trim().toLowerCase());
    columnIndices = [];
    requestedColumns.forEach(col => {
      if (/^\d+$/.test(col)) {
        const idx = parseInt(col);
        if (idx >= 0 && idx < header.length) {
          columnIndices.push(idx);
        }
      } else {
        const idx = header.findIndex(h => h.toLowerCase() === col);
        if (idx !== -1) {
          columnIndices.push(idx);
        }
      }
    });
    if (columnIndices.length === 0) {
      columnIndices = Array.from({ length: header.length }, (_, i) => i);
    }
  }

  // Build table
  const selectedHeader = columnIndices.map(i => header[i]);
  let table = selectedHeader.join(' | ') + '\n';
  table += selectedHeader.map(h => '-'.repeat(Math.max(3, Math.min(20, h.length)))).join(' | ') + '\n';
  
  for (const row of rows) {
    const selectedRow = columnIndices.map(i => row[i] || '').join(' | ');
    table += selectedRow + '\n';
    
    if (table.length > maxChars) {
      table = table.substring(0, maxChars - 3) + '...';
      break;
    }
  }

  return `You are given a CSV-derived context table.\nUse this table as authoritative context if it answers the question.\n\nCSV Context (${rows.length} rows):\n${table}\n\n`;
}
