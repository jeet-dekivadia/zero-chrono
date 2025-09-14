# 0chrono - AI-Native Medical Platform

**Tagline: "See more patients, not more pages"**

0chrono is a revolutionary AI-native medical platform that transforms how healthcare professionals work through voice-activated assistance and intelligent automation.

## 🤖 Meet Bob - Your AI Medical Assistant

Bob is an advanced AI assistant that processes voice commands to:
- Update patient records automatically
- Generate OPD summaries from conversations
- Schedule appointments and follow-ups
- Handle emergency service requests
- Process insurance claims and adjudication
- Create executive summaries for insurance companies

## ✨ Key Features

### Voice-First Interface
- Natural language voice commands
- Real-time speech recognition
- Intelligent command processing
- Voice feedback and confirmation

### Patient Management
- Comprehensive patient profiles
- Medical history tracking
- Allergy and medication management
- Automated OPD summary generation

### Smart Scheduling
- Voice-activated appointment booking
- Calendar integration
- Follow-up reminders
- Emergency service coordination

### Insurance Integration
- Automated claim processing
- Coverage verification
- Executive summary generation
- AI-powered adjudication

### Privacy & Security
- Local conversation processing
- HIPAA-compliant data handling
- Secure API communications
- Privacy-first architecture

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cerebras API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zero-chrono/zero-chrono-fe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_BASE_URL=https://api.cerebras.ai/v1
CEREBRAS_MODEL=llama3.1-8b
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage Examples

### Voice Commands for Bob

**Prescription Management:**
- "Hey Bob, add paracetamol 500mg twice daily for John Doe"
- "Prescribe metformin 500mg for patient Sarah with diabetes"

**Appointment Scheduling:**
- "Schedule a follow-up for Michael next Tuesday at 2 PM"
- "Book Emma for a consultation tomorrow morning"

**Emergency Services:**
- "Call anesthetics to OR-3 urgently"
- "Need cardiology support in ICU immediately"

**Insurance Processing:**
- "Generate insurance claim for today's consultation with John"
- "Process coverage verification for Sarah's lab tests"

## 🏗️ Architecture

### Frontend (NextJS)
- React-based user interface
- Voice recognition integration
- Real-time dashboard updates
- Responsive design

### Backend (NextJS API Routes)
- RESTful API endpoints
- Cerebras AI integration
- Voice command processing
- Data validation and security

### AI Integration
- Cerebras API for language processing
- Local conversation analysis
- Privacy-preserving AI operations
- Structured data extraction

## 📁 Project Structure

```
zero-chrono-fe/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── landing/       # Landing page
│   │   └── page.tsx       # Main dashboard
│   ├── components/
│   │   ├── ui/            # UI components
│   │   ├── BobAssistant.tsx
│   │   ├── EnhancedDashboard.tsx
│   │   └── ...
│   └── lib/
│       ├── cerebras.ts    # AI integration
│       └── database.ts    # Data schemas
├── public/                # Static assets
└── ...
```

## 🔧 API Endpoints

### Voice Processing
- `POST /api/voice` - Process voice commands
- `GET /api/voice-commands` - Get command history

### Patient Management
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient

### OPD Summaries
- `GET /api/opd-summaries` - Get summaries
- `POST /api/opd-summaries` - Create summary

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Schedule appointment

### Emergency Services
- `GET /api/emergency` - List emergency requests
- `POST /api/emergency` - Create emergency request

### Insurance
- `GET /api/insurance` - List claims
- `POST /api/insurance` - Process claim

## 🔒 Security & Privacy

- All patient data is handled according to HIPAA guidelines
- Voice processing can be done locally for privacy
- API communications are encrypted
- Access controls and authentication (to be implemented)
- Audit logging for all medical actions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Roadmap

- [ ] Real database integration
- [ ] User authentication system
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with hospital systems
- [ ] Telemedicine features
- [ ] Advanced AI models

---

**0chrono** - Transforming healthcare through AI-native technology.
