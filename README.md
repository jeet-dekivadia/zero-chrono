# ⏱️ Zero Chrono — Knowledge-Graph Powered Medical AI Platform  

> **“See more patients, not more pages.”**  
> A next-gen healthcare orchestration system built on **GraphRAG** (Graph-based Retrieval Augmented Generation), seamlessly integrating **doctor–patient workflows, clinical protocols, and real-time EHR streams** into a unified AI-driven assistant.  

---

At 3 AM during HackMIT, Jeet Dekivadia, Revanth Reddy, Pratham Pill, and Samuel Wang were working on a problem they’d been discussing for months: why was healthcare tech still stuck in the past? Jeet, who had shadowed doctors, noted how much time physicians spent wrestling with clunky EHRs instead of treating patients. “DrChrono was great for 2009,” he said, “but today’s AI can do much more.”

The idea clicked when Samuel, tired of filling out endless forms, said, “I wish I could just tell this thing what to do.” Instead of doctors adapting to software, what if the software adapted to doctors? That became 0chrono—an AI-native medical assistant built around natural language.

The team combined Next.js and Supabase with Cerebras-powered AI for real-time voice commands, intelligent scheduling, and predictive insights. A doctor could simply say, “Schedule John Doe for a follow-up next week,” and the system would create the appointment, pull labs, flag prescriptions, and adjust schedules automatically.

Unlike older EHRs, 0chrono learns physician preferences, anticipates needs, and provides proactive care insights. In just 36 hours, the team built a working platform showing that the future of healthcare tech isn’t digitizing old workflows but reimagining them with AI at the core.

---


## 🚀 Overview  

Zero Chrono is not just another AI dashboard.  
It is a **graph-native reasoning engine** for healthcare:  

- **Knowledge Graph Substrate** — encodes patients, clinicians, diagnoses, labs, medications, and administrative workflows into a **heterogeneous medical knowledge graph**.  
- **GraphRAG Pipeline** — queries traverse semantic neighborhoods (Patient ↔ Symptom ↔ Lab ↔ Treatment ↔ Insurance), providing **contextual retrieval with ontological precision**.  
- **Generative Overlay** — outputs are grounded in graph-validated substructures, minimizing hallucination and reducing epistemic drift.  
- **Carbon-Conscious Optimization** — localized subgraph reasoning slashes compute costs, enabling a **Green AI mode** with token caching and context reuse.  
- **Workflow Symbiosis** — every doctor command reinforces the graph, making Zero Chrono smarter with each interaction.  

---

> ⚠️ **Why Zero Chrono?**  
> The legacy **DrChrono platform** is built on rigid, form-driven EHR systems that drown clinicians in clicks and fragmented workflows.  
> **Zero Chrono kills that paradigm** — replacing page-heavy interfaces with a **knowledge-graph powered, AI-first orchestration layer**.  
> Instead of managing forms, doctors manage patients — with context-aware automation, real-time reasoning, and carbon-conscious AI at the core.

---


## 🏗️ Architecture  


        ┌───────────────────────────────┐
        │ Doctor / Patient Interaction  │
        └─────────────┬─────────────────┘
                      │
    ┌─────────────────▼──────────────────┐
    │      Entity Extraction Layer        │
    │  (NER, embeddings, ICD-10 mapping) │
    └─────────────────┬──────────────────┘
                      │
    ┌─────────────────▼──────────────────┐
    │   Heterogeneous Knowledge Graph     │
    │  (Patients, Labs, Claims, Drugs)   │
    └─────────────────┬──────────────────┘
                      │
    ┌─────────────────▼──────────────────┐
    │  Graph Traversal + Context Pruning  │
    │   (subgraph localization engine)   │
    └─────────────────┬──────────────────┘
                      │
    ┌─────────────────▼──────────────────┐
    │      Generative LLM Overlay         │
    │   (graph-grounded RAG responses)   │
    └─────────────────┬──────────────────┘
                      │
    ┌─────────────────▼──────────────────┐
    │ Carbon-Aware Optimizer + Actions   │
    │  (cache, compression, claim filing)│
    └────────────────────────────────────┘


---

## ✨ Features  

- **🩺 Clinical Inbox** – Real-time patient data + AI task triage  
- **📋 Tasks Engine** – AI-driven decisions (drug interactions, lab analysis, claim processing)  
- **👨‍⚕️ Bob Assistant** – Voice + text AI assistant with command history and confidence scoring  
- **🧩 Knowledge Graph** – Interactive visualization of drug interactions and patient relationships  
- **📊 Analytics Dashboard** – Performance + *Carbon / Cost* metrics with **Green Mode**  
- **📝 System Logs** – Transparent real-time AI decision traceability  

---

## ⚡ Why GraphRAG?  

Traditional RAG = flat text retrieval.  
**GraphRAG** = *relational retrieval* that understands **multi-entity clinical contexts**.  

- **Precision:** No more prompt-stuffing; retrieval follows relational edges.  
- **Safety:** Graph-grounding minimizes hallucination in high-stakes environments.  
- **Efficiency:** Subgraph pruning reduces tokens + energy overhead.  
- **Scalability:** Graph grows with every interaction, unlocking **population-level insights**.

---

## 🛠️ Tech Stack  

- **Frontend:** Next.js 15 + React 19 + TailwindCSS + shadcn/ui  
- **Backend:** Node.js + GraphQL APIs + Python micro-services  
- **Knowledge Graph:** Neo4j / Graph embeddings (PyTorch Geometric)  
- **LLM Layer:** OpenAI GPT + GraphRAG orchestration  
- **Infra:** Vercel (frontend), Docker (backend), AWS (scaling)  

---

## 🔒 Compliance & Ethics  

- HIPAA-aligned data flows  
- Transparent audit logs (System Logs panel)  
- Green Mode for **carbon-aware compute**  
- Built for **doctor-in-the-loop AI** — not black-box autonomy  

---

## 🧪 Getting Started  

```bash
# Clone repo
git clone https://github.com/your-org/zero-chrono.git
cd zero-chrono

# Install deps
npm install

# Start dev server
npm run dev

# Backend setup (Python micro-services)
cd backend
pip install -r requirements.txt
python main.py

---

🔮 Vision

From individual doctor–patient encounters → to graph-native, population-level healthcare analytics.
Zero Chrono is the bridge between human intuition and machine reasoning, transforming how medicine scales in the 21st century.

📄 License

MIT © 2025 Zero Chrono Team
