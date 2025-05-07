# 🌐 FoodRxCheck - Web App (React + Vite)

<p align="center">
  <img src="https://github.com/user-attachments/assets/599beb82-7431-459c-af7d-17d3f8cd82af" width="100" height="100" style="border-radius: 10px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);" />
</p>

## 📌 Overview

**FoodRxCheck** Web App is a modern, fast, and responsive platform developed using **React** and **Vite**, designed to help users (Healthcare Professionals and Patients) explore and understand potential food-drug interactions efficiently. It mirrors the mobile experience with enhancements for web usability and accessibility.

---

## 🚀 Features

### 👨‍⚕️ For Patients
- 📖 **General Drug Instructions**
- 💊 **Patient Counseling Info** with simple explanations
- 🔍 **Search Drugs** by:
  - 🔠 Alphabetical drug list
  - 🍎 Food-based lookup (search food, see affected drugs)

### 🏥 For Healthcare Professionals (HCPs)
- 📋 **Drug Classification View**: class and subclass-based hierarchy
- 🔬 **Mechanism of Action** and interaction severity info
- 🔍 **Search Options**:
  - 🔠 Alphabetically
  - 🏷️ By Drug Class (Faceted Search)
  - 🍎 By Food Interaction

---

## 🏗️ Tech Stack

| Layer         | Technologies Used                     |
|---------------|----------------------------------------|
| Frontend      | React • Vite • TailwindCSS             |
| State Mgmt    | React Context API / useState/useEffect |
| Backend       | Supabase (PostgreSQL + Auth)           |
| Auth          | Supabase Email Authentication          |
| Deployment    | Vercel        |

---

## 🔐 Authentication Roles

| Role            | Access Level                    |
|------------------|---------------------------------|
| Patient          | General drug guidance & counseling |
| Healthcare Pro   | Full drug database with mechanisms & food interaction alerts |

---

## 🗃️ Supabase Schema

### HCP Table

| Column             | Description                              |
|--------------------|------------------------------------------|
| Class              | Drug category (e.g., Analgesics)         |
| Subclass           | Subdivision within the class             |
| Drug               | Drug name                                |
| Food               | Interacting food(s)                      |
| MechanismOfAction  | Pharmacological explanation              |
| Severity           | Mild / Moderate / Severe                 |
| Management         | Guidance to handle the interaction       |
| Reference          | Source/Research citation                 |

### Patient Table

| Column              | Description                           |
|---------------------|---------------------------------------|
| GeneralInstructions | Basic drug usage guidance             |
| Counseling          | Food interaction summary for patients |

---

