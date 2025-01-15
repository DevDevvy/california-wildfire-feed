# **Wildfire Tracker**

A React/Vite application that displays live wildfire incident data. The app includes:

- A **List View** displaying all wildfire details.
- An optional **Map View** showing the incidents' locations on a Google Map.

The project is set up to run locally, bypassing CORS issues via a local proxy.

---

## **Features**

- Live data updates every 30 seconds.
- Displays wildfire details in a structured list.
- Optional Google Maps integration to visualize wildfire locations on a map.
- Each incident includes a "More Info" link that opens its coordinates in [fire.ca.gov](https://www.fire.ca.gov/).

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/wildfire-tracker.git
cd wildfire-tracker
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Up the Environment Variables**

1. In the root of the project, create a `.env` file:
   ```bash
   touch .env
   ```
2. Add the following variable to the `.env` file:
   ```
   VITE_GOOGLE_API_KEY=your_google_maps_api_key_here
   ```
   - If you do not wish to use the Google Maps feature, leave this variable empty.

---

### **4. Run the Project**

- **With Maps Integration**:
  If you’ve added a Google Maps API key to `.env`:
  ```bash
  npm run dev
  ```
- **Without Maps Integration**:
  If the API key is not provided, the app will automatically run without the map feature.

---

## **How It Works**

The project uses a local proxy to bypass CORS issues when accessing the wildfire data API. This setup is pre-configured, and no additional steps are required.

---

## **Environment Variables**

| Key                   | Description                                   |
| --------------------- | --------------------------------------------- |
| `VITE_GOOGLE_API_KEY` | Your Google Maps API key (optional for maps). |

---

## **Technologies Used**

- **React**: Front-end framework.
- **Vite**: Build tool for fast development.
- **Axios**: HTTP client for fetching data.
- **@react-google-maps/api**: Google Maps integration (optional).
- **PropTypes**: Runtime type checking for props.

---

## **Project Structure**

```
wildfire-tracker/
├── public/               # Static assets
├── src/                  # Application source code
│   ├── components/       # React components
│   │   ├── IncidentList.jsx  # Displays the wildfire list
│   │   ├── MapView.jsx       # Displays the Google Map (if API key is provided)
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
├── .env                  # Environment variables (Google API key)
├── package.json          # Project dependencies and scripts
```

---

## **Contributing**

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License.
