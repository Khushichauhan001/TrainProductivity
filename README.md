# AI-Powered Train Traffic Controller

A full-stack web application that uses AI to optimize train traffic management with real-time monitoring, intelligent decision-making, and simulation capabilities.

## 🚂 Features

### Dashboard & Monitoring
- **Real-time Train Dashboard**: Live tracking of all trains with status, delays, and route progress
- **KPIs Dashboard**: Comprehensive metrics including on-time performance, throughput, and track utilization
- **Interactive Charts**: Visual representation of key performance indicators using Recharts

### AI-Powered Intelligence
- **Smart Recommendations**: AI-generated decisions for train precedence, holds, and rerouting
- **Constraint-Based Optimization**: Rule-based system with genetic algorithm concepts
- **Confidence Scoring**: Each recommendation comes with a confidence percentage

### Simulation & Planning
- **What-If Scenarios**: Test different optimization strategies
- **Impact Analysis**: See potential improvements in delays and throughput
- **Strategic Recommendations**: Get actionable insights for infrastructure improvements

### User Management
- **JWT Authentication**: Secure login system with role-based access
- **Role-Based Access**: Admin and operator roles with different permissions
- **Audit Trail**: All decisions are logged for accountability

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **SQLite** with better-sqlite3 for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing

### AI Engine
- Custom rule-based optimization system
- Priority-based decision making
- Traffic conflict detection
- Simulation algorithms

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```
   
   This will start both the frontend (port 5173) and backend (port 3001) servers.

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Default Credentials
```
Admin: username="admin", password="admin123"
Operator: username="operator", password="operator123"
```

## 📊 Sample Data

The application comes with realistic Indian railway data including:
- **Rajdhani Express** (High priority, express service)
- **Shatabdi Express** (High priority, day train)
- **Goods Train** (Low priority, freight service)
- **Jan Shatabdi** (Medium priority, passenger service)
- **Duronto Express** (High priority, non-stop service)

Each train includes:
- Route information with station names
- Current position and progress
- Priority levels (1-10)
- Real-time status updates
- Delay tracking

## 🤖 AI Decision Engine

### Decision Factors
- **Train Priority**: Express trains get higher precedence
- **Section Capacity**: Monitors track utilization
- **Delay Management**: Reschedules trains with significant delays
- **Conflict Resolution**: Detects and resolves traffic conflicts

### Algorithms Used
- Priority-based scheduling
- Capacity constraint checking
- Genetic algorithm concepts for optimization
- Real-time conflict detection

## 📱 User Interface

### Dashboard Views
1. **Main Dashboard**: KPIs overview with active trains and recommendations
2. **Trains View**: Complete train listing with management controls
3. **AI Recommendations**: Live AI suggestions with reasoning
4. **Simulation Panel**: What-if scenario testing

### Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for enhanced UX
- **Modern UI**: Clean, professional interface with hover effects
- **Real-time Updates**: Live data refresh every 30 seconds

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Audit logging for all decisions
- Input validation and sanitization

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Trains
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get specific train
- `PUT /api/trains/:id` - Update train
- `POST /api/trains/decision` - Make traffic decision

### AI
- `GET /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/simulate` - Run simulation
- `GET /api/ai/kpis` - Get performance metrics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file for production:
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-key
PORT=3001
```

## 📈 Performance Optimization

- SQLite for fast, lightweight data storage
- Efficient React re-renders with proper state management
- Lazy loading and code splitting
- Optimized API calls with caching
- Real-time updates without excessive polling

## 🔮 Future Enhancements

- Integration with real railway APIs
- Machine learning model for predictive analytics
- WebSocket for real-time updates
- Mobile app development
- Advanced reporting and analytics
- Integration with weather and traffic data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Indian Railways for inspiration
- React and Node.js communities
- Contributors to all open-source libraries used

---

Made with ❤️ for better railway traffic management