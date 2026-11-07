
# 🏭 Quality Control Defect Prediction System

An intelligent web-based Quality Control Defect Prediction System designed to estimate manufacturing defect risk using production process parameters. The system helps identify high-risk production batches, improve inspection efficiency, and support data-driven quality management.

## 🌐 Live Demo

🚀 **[Click Here to View the Live Application](https://qc-defect-prediction-system.onrender.com/)**

Explore the application and its quality control dashboard.

---

## 📌 Problem Statement

Manual quality inspection in manufacturing industries is time-consuming and may produce inconsistent results. This can allow defective products to reach customers, increasing production costs and reducing product quality.

This project aims to develop a system that analyzes manufacturing process parameters, estimates defect risk, and identifies high-risk production batches for further inspection.

## 🎯 Objectives

- Record production process parameters for each manufacturing batch.
- Estimate the probability of manufacturing defects.
- Identify and flag high-risk production batches.
- Track inspection results and batch status.
- Provide an analytics dashboard for monitoring production quality.
- Support faster and more consistent quality inspection.

## 🧩 System Modules

### 1. Authentication & Role Management
- User authentication.
- Role-based access management.
- Secure access to application modules.

### 2. Process Parameter Logging
- Record manufacturing batch details.
- Store production parameters.
- Manage batch information.

### 3. Defect Prediction Engine
- Analyze production process parameters.
- Estimate defect probability.
- Classify batches based on risk level.
- Generate prediction results.

### 4. Inspection Workflow
- Identify high-risk batches.
- Flag batches for inspection.
- Record actual inspection results.
- Track inspection status and feedback.

### 5. Analytics Dashboard
- Display production batch information.
- Monitor defect risk levels.
- Visualize quality-related statistics.
- Track inspection activities.

## 🔄 System Workflow

```text
       User / Administrator
                |
                v
    Authentication & Role Management
                |
                v
       Process Parameter Logging
                |
                v
        Defect Prediction Engine
                |
                v
         Risk Classification
                |
                v
          Inspection Workflow
                |
                v
          Analytics Dashboard
                |
                v
             Final Output
```

## 🤖 Machine Learning Integration

The project is designed around manufacturing defect prediction using classification techniques.

### Model Workflow

1. Collect manufacturing production data.
2. Clean and preprocess the dataset.
3. Select relevant production parameters.
4. Train and evaluate a classification model.
5. Use the model to estimate defect probability for new batches.
6. Classify batches according to predicted risk.
7. Support inspection decisions using prediction results.

### Expected Model Output

- Defect probability.
- Predicted defect status.
- Batch risk classification.
- Inspection recommendation.

**Note:** The final algorithm and evaluation metrics should be documented after confirming the actual model implementation and experimental results.

## 📊 Dataset

**Dataset Source:** Kaggle

The manufacturing quality dataset is intended for model development and evaluation.

Dataset attributes may include production-related parameters such as:

- Temperature
- Pressure
- Vibration
- Machine speed
- Cycle time
- Humidity
- Cooling rate

The selected features depend on the actual dataset used in the project.

## 🛠️ Technology Stack

| Domain | Technologies / Application |
|---|---|
| Frontend | React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Machine Learning | Classification-based defect prediction |
| Data Processing | Python (if used for model training) |
| Version Control | Git and GitHub |
| Deployment | Render |

*Update this table if your actual implementation uses different technologies.*

## 🗄️ Database Integration

The application uses MySQL to store manufacturing batch information.

**Database Name:** `qc_factory_db`

**Table Name:** `machine_batches`

The database is designed to store:

- Batch identification details.
- Manufacturing process parameters.
- Defect probability and risk level.
- Predicted defect information.
- Inspection status.
- Actual inspection results.
- Inspector feedback.

## ⚙️ Installation & Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MySQL Server
- Git
- Python (if required for separate ML model execution)

### 1. Clone the Repository

```bash
git clone https://github.com/MailaAkhil/Quality-defect-system.git
```

### 2. Navigate to the Project Folder

```bash
cd Quality-defect-system
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create the required environment file in the project root.

Example `.env` configuration for local MySQL:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=qc_factory_db
```

If your application uses Gemini API, configure:

```env
GEMINI_API_KEY=your_gemini_api_key
```

**Important:** Replace the example values with your actual credentials. Never upload `.env` files, database passwords, or API keys to GitHub.

### 5. Create the Database

Open MySQL and execute:

```sql
CREATE DATABASE qc_factory_db;
```

Create the required `machine_batches` table using the database schema provided in the project.

### 6. Run the Application

```bash
npm run dev
```

Open the local URL displayed in your terminal.

*Note: If the backend runs as a separate process, start it using the backend command defined in `package.json`.*

## 📁 Project Structure

```text
Quality-defect-system/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── server/
│   └── ...
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── ...
```

*Note: This is an illustrative structure. Actual directories and files may differ.*

## 🔐 Security

- Keep database credentials in environment variables.
- Never expose API keys in frontend code.
- Add secret environment files to `.gitignore`.
- Validate user inputs before processing.
- Use appropriate authentication and authorization.

## 🔮 Future Enhancements

- Real-time production data integration.
- Improved prediction accuracy through model optimization.
- Advanced batch monitoring and reporting.
- Automated alerts for high-risk batches.
- Historical defect trend analysis.
- Continuous model improvement using inspection feedback.

## 👨‍💻 Project Information

**Project Title:** Quality Control Defect Prediction System

**Domain:** Machine Learning and Full Stack Development

**Project Type:** Academic Project

**Team:** Codebreakerz

**Institution:** Rajeev Gandhi Memorial College of Engineering and Technology (RGMCET), Nandyal.

## 📄 License

This project is developed for academic and educational purposes.

---

⭐ If you find this project interesting, consider giving the repository a star!
