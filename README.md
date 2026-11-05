# 🏭 Quality Control Defect Prediction System

An ML-powered quality control system designed to predict the likelihood of manufacturing defects using production process parameters. The system helps identify high-risk production batches, improve inspection efficiency, and support data-driven quality management.

## 🎯 Problem Statement

Manual quality inspection on manufacturing production lines is time-consuming and inconsistent. This can allow defective products to reach customers, resulting in increased production costs and reduced product quality.

This project aims to develop a machine learning-based system that predicts the likelihood of defects using production process parameters and identifies high-risk batches for further inspection.

## 🚀 Objectives

- Record production process parameters for each manufacturing batch.
- Predict the probability of defects using a machine learning model.
- Identify and flag high-risk production batches.
- Track inspection results for future model improvement.
- Provide an analytics dashboard to monitor production quality.
- Support faster and more consistent quality inspection.

## 🧩 System Modules

### 1. Authentication & Role Management
Provides user authentication and role-based access to the system.

### 2. Process Parameter Logging
Allows users to enter and manage production process parameters for different batches.

### 3. Defect Prediction Engine
Uses a machine learning classification model to predict defect likelihood based on production parameters.

### 4. Inspection Workflow
Helps quality control teams identify high-risk batches, record inspection results, and track inspection status.

### 5. Analytics Dashboard
Displays production quality information, defect statistics, batch-level predictions, and inspection analytics.

## 🔄 System Workflow

```text
             User / Student
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
            Inspection Workflow
                   |
                   v
           Analytics Dashboard
                   |
                   v
             Final Output
```

## 🤖 Machine Learning Integration

The system uses machine learning classification techniques to estimate the likelihood of manufacturing defects.

**Model Workflow:**

1. Collect manufacturing production data.
2. Perform data preprocessing and cleaning.
3. Select relevant production parameters as input features.
4. Train a classification model using the dataset.
5. Predict defect probability for new production batches.
6. Identify high-risk batches for quality inspection.

**Expected Model Output:**

- Defect probability.
- Predicted defect status.
- Batch risk classification.
- Inspection recommendation.

*Note: The actual algorithm and evaluation metrics depend on the trained model and experimental results.*

## 🛠️ Technology Integration

| Domain | Application |
|---|---|
| Machine Learning | Classification-based defect prediction |
| Full Stack Development | Web-based quality control dashboard |
| Software Engineering | Modular architecture and documented APIs |
| Operating Systems | Concurrent processing of production batch data |

## 📊 Dataset

**Dataset Source:** Kaggle

The manufacturing quality dataset is used to train and evaluate the machine learning model for identifying defects based on production-related parameters.

## ⚙️ Installation & Setup

### Prerequisites

- Node.js
- npm
- Python (if the ML model runs separately)
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd quality-control-defect-prediction-system
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and add the required environment variables.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Only configure the Gemini API key if your application uses the Gemini API. Add other required database or backend variables according to your project configuration.

**Important:** Never upload API keys, passwords, or secret environment files to GitHub.

### 5. Run the Application

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## 📁 Project Structure

```text
quality-control-defect-prediction-system/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

*Note: The folder structure is illustrative. Actual folders may differ depending on the implementation.*

## 🔮 Future Enhancements

- Real-time production data integration.
- Improved prediction accuracy through model optimization.
- Advanced batch monitoring and reporting.
- Automated inspection alerts for high-risk batches.
- Historical defect trend analysis.
- Continuous model improvement using inspection feedback.

## 📄 License

This project is developed for academic and educational purposes.
