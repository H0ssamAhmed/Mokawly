# PaintTrack - Painting Contractor Management System

## Overview

PaintTrack is a comprehensive web-based system designed to help painting contractors manage their day-to-day operations. Whether you're handling multiple jobs from different companies or managing a team of workers and craftsmen, this system simplifies everything in one place.

## Key Features

### 🏢 Company Management

- Add and manage companies and clients
- Store contact information for company representatives
- Add notes and additional information for each company

### 👷 Worker Management

- Add and manage workers and craftsmen
- Set daily wages for each worker
- Categorize workers (Worker / Craftsman)
- Manage contact information and notes
- Publish/unpublish worker data for public access

### 📅 Attendance System

- Daily worker attendance tracking
- Search attendance records by date
- Calculate total daily wages
- Add attendance notes

### 💰 Expense Management

- **Job Expenses**: Track project expenses (transportation, food, materials, tools, equipment)
- **Worker Expenses**: Track personal expenses for workers
- Filter expenses by type and date
- Track who made the payment

### 💳 Payment Management

- Record payments received from companies
- Group payments by company
- Display payment statistics
- Track payment history

### 📊 Dashboard

- Comprehensive project statistics
- Profit and loss calculations
- Total expenses and payments overview
- Filter data by time period

### 👤 User System

- Login and logout functionality
- Permission management
- Arabic user interface
- Dark/Light mode support

## Technology Stack

### Frontend

- **React 18** - User interface library
- **TypeScript** - Type-safe code development
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Radix UI** - Primitive UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **date-fns** - Date manipulation

- **React Hot Toast** - Toast notifications

### Backend & Database

- **Convex** - Real-time database
- **Convex Functions** - Server functions
- **Convex Schema** - Database schema

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
PaintTrack/
├── convex/                     # Backend & Database
│   ├── _generated/           # Generated Convex files
│   ├── schema.ts             # Database schema
│   ├── worker.js             # Worker management functions
│   ├── company.js            # Company management functions
│   ├── attendance.js         # Attendance management functions
│   ├── expenses.js           # Expense management functions
│   ├── payment.js            # Payment management functions
│   └── statistics.js         # Statistics functions
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Base UI components
│   │   ├── worker/          # Worker management components
│   │   ├── company/         # Company management components
│   │   ├── attendance/      # Attendance management components
│   │   ├── expense/         # Expense management components
│   │   └── payment/         # Payment management components
│   ├── pages/               # Application pages
│   ├── types/               # TypeScript definitions
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   └── App.tsx              # Main component
├── public/                  # Public assets
└── package.json             # Project dependencies
```

## Database Schema

### Database Tables

#### 1. Workers Table (worker)

```typescript
{
  name: string,           // Worker name
  phone?: string,         // Phone number (optional)
  type: string,           // Worker type (Worker / Craftsman)
  dailyWage: number,      // Daily wage
  isPublished: boolean,   // Public access permission
  note?: string,          // Notes (optional)
}
```

#### 2. Attendance Table (attendance)

```typescript
{
  workerId: string,       // Worker ID
  date: string,           // Attendance date
  name: string,           // Worker name
  dailyWage: number,      // Daily wage
  note?: string,          // Notes (optional)
}
```

#### 3. Worker Expenses Table (workerExpense)

```typescript
{
  workerId: string,       // Worker ID
  workerName: string,     // Worker name
  paidBy: string,         // Who paid
  amount: number,         // Amount
  date: string,           // Expense date
  description?: string,   // Expense description (optional)
}
```

#### 4. Job Expenses Table (jobExpense)

```typescript
{
  type: string,           // Expense type
  description: string,    // Expense description
  paidBy: string,         // Who paid
  amount: number,         // Amount
  date: string,           // Expense date
}
```

#### 5. Companies Table (company)

```typescript
{
  name: string,           // Company name
  person_one?: string,    // First representative
  person_one_phone?: string, // First representative phone
  person_two?: string,    // Second representative
  person_two_phone?: string, // Second representative phone
  note: string,           // Notes
}
```

#### 6. Payments Table (payment)

```typescript
{
  companyId: string,      // Company ID
  amount: number,         // Payment amount
  date: string,           // Payment date
  note?: string,          // Notes (optional)
}
```

## Pages and Functionality

### 1. Dashboard

- Display comprehensive project statistics
- Calculate profits and losses
- Show total expenses and payments
- Filter data by time period
- Export reports

### 2. Workers Management

- Add new workers
- Edit worker information
- Delete workers
- Publish/unpublish worker data
- Display worker list
- Search workers

### 3. Companies Management

- Add new companies
- Edit company information
- Delete companies
- Manage representative information
- Display company list

### 4. Attendance Management

- Record daily worker attendance
- Search attendance records
- Display attendance statistics
- Add attendance notes
- Calculate total wages

### 5. Expense Management

- **Job Expenses**:
  - Add new expenses
  - Filter by type
  - Track who made the payment
- **Worker Expenses**:
  - Add worker expenses
  - Link expenses to workers
  - Track personal expenses

### 6. Payment Management

- Record new payments
- Display payments by company
- Calculate total payments
- Display payment statistics

### 7. Worker Summary

- Display worker details
- Show attendance records
- Display personal expenses
- Calculate totals

## Installation and Setup

### Prerequisites

- Node.js (version 18 or later)
- npm, yarn, or bun
- Convex account

### Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd PaintTrack
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
bun install
```

3. **Setup Convex**

```bash
npx convex dev
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

5. **Build for production**

```bash
npm run build
# or
yarn build
# or
bun run build
```

## Environment Setup

### Environment Variables

Create a `.env.local` file and add the following variables:

```env
VITE_CONVEX_URL=your_convex_url
VITE_CONVEX_DEPLOY_KEY=your_deploy_key
```

### Convex Setup

1. Create an account on [Convex](https://convex.dev)
2. Create a new project
3. Follow the setup instructions
4. Copy the URL and Deploy Key to your environment file

## Deployment

### Deploy to Vercel

1. Connect your project to GitHub
2. Connect your project to Vercel
3. Add environment variables in Vercel
4. Deploy the project

### Deploy to Other Platforms

The project can be deployed to any platform that supports React applications:

- Netlify
- Firebase Hosting
- AWS Amplify
- GitHub Pages

### User Management

- Secure login system
- Permission management
- Automatic logout

## Performance

### Performance Optimizations

- Use React.memo for components
- Code splitting for lazy loading
- Optimize images and assets
- Use React Query for caching

### Monitoring

- Application performance monitoring
- Error tracking
- User analytics

## Maintenance and Development

### Development Guidelines

- Follow the specified Git Workflow standards [workflow.md](/workflow.md)
- Use TypeScript for all new files
- Write clear code comments
- Test code before deployment

### Version Management

- Use Semantic Versioning
- Maintain change logs
- Test new versions

### Backups

- Automatic database backups
- Source code version control
- Configuration documentation

## Support and Help

### Documentation

- This file contains basic documentation
- Review README.md for additional information
- Check code comments for technical details

### Contact

- For technical support: hossamahmed123456789@gmail.com
- LinkedIn: https://www.linkedin.com/in/dev-hossam-ahmed/

### Contributing

- Contributions and improvements are welcome
- Follow contribution guidelines
- Test changes before submission

## API Reference

### Worker Functions

- `addWorker` - Add a new worker
- `getWorkers` - Get all workers
- `getWorker` - Get specific worker
- `updateWorker` - Update worker information
- `deleteWorker` - Delete a worker
- `publishWorker` - Publish/unpublish worker data
- `getWorkerDate` - Get worker data with attendance and expenses
- `getPublicWorkerDate` - Get public worker data

### Company Functions

- `addCompany` - Add a new company
- `getCompanies` - Get all companies
- `updateCompany` - Update company information
- `deleteCompany` - Delete a company

### Attendance Functions

- `saveAttendances` - Save daily attendance records
- `getAttendanceByDate` - Get attendance by date

### Expense Functions

- `addJobExpense` - Add job expense
- `AddworkerExpense` - Add worker expense
- `getJobExpenses` - Get all job expenses
- `getWorkerExpenses` - Get all worker expenses

### Payment Functions

- `addPayment` - Add new payment
- `getAllPayments` - Get all payments

### Statistics Functions

- `getStatistics` - Get comprehensive statistics

## Database Indexes

### Performance Optimizations

- `by_workerId` - Index on workerId for attendance and expenses
- `by_date` - Index on date for attendance records
- `by_companyId` - Index on companyId for payments

## Error Handling

### Client-Side Error Handling

- Toast notifications for user feedback
- Loading states for better UX
- Error boundaries for React components

### Server-Side Error Handling

- Convex error handling
- Input validation
- Database constraint checking

## Code Quality

### Linting and Formatting

- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Consistent code style

### Code Review Process

- Pull request reviews
- Automated testing
- Code quality checks
- Performance monitoring

## Future Enhancements

### Planned Features

- Advanced reporting and analytics
- Mobile application
- Multi-language support
- Advanced user permissions
- Integration with accounting software
- Automated invoice generation
- Project timeline management
- Resource allocation optimization

### Technical Improvements

- Performance optimizations
- Enhanced security features
- Better error handling
- Improved user experience
- Advanced data visualization

## Installation Issues

- Ensure Node.js version 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

#### Convex Issues

- Check environment variables
- Verify Convex project setup
- Check network connectivity

#### Build Issues

- Check TypeScript errors
- Verify all dependencies are installed
- Check for conflicting package versions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Convex team for the excellent real-time database
- shadcn/ui for the beautiful component library
- React team for the amazing framework
- All contributors and users of PaintTrack

---

**_Version_**: 1.0.0  
**_Last Updated_**: July 2025  
**_Developer_**: Hossam Ahmed
