import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import image from "./Logo.png";

const calculationParameters = {
  "Drill String Capacity": [
    { name: "diameter", placeholder: "Diameter (in inches)" },
    { name: "length", placeholder: "Length (in feet)" },
  ],
  "Oil-in-Place Calculations": [
    { name: "area", placeholder: "Area (in acres)" },
    { name: "thickness", placeholder: "Thickness (in feet)" },
    { name: "porosity", placeholder: "Porosity (as a decimal)" },
    { name: "saturation", placeholder: "Water Saturation (as a decimal)" },
  ],
  "Gas-in-Place Calculations": [
    { name: "volume", placeholder: "Volume (in cubic feet)" },
    { name: "zFactor", placeholder: "Compressibility Factor (Z)" },
    { name: "temperature", placeholder: "Temperature (in Rankine)" },
  ],
  "Drill Pipe Nozzle Calculation": [
    { name: "flowRate", placeholder: "Flow Rate (in gallons per minute)" },
    { name: "nozzleDiameter", placeholder: "Nozzle Diameter (in inches)" },
    { name: "pressure", placeholder: "Pressure (in psi)" },
  ],
  "Annular Capacity": [
    { name: "outerDiameter", placeholder: "Outer Diameter (in inches)" },
    { name: "innerDiameter", placeholder: "Inner Diameter (in inches)" },
    { name: "length", placeholder: "Length (in feet)" },
  ],
  "Equivalent Circulating Density (ECD)": [
    { name: "mudWeight", placeholder: "Mud Weight (in ppg)" },
    { name: "pressure", placeholder: "Pressure (in psi)" },
    { name: "depth", placeholder: "Depth (in feet)" },
  ],
  "Pump Flow Rate (Duplex Pump)": [
    { name: "cylinderDiameter", placeholder: "Cylinder Diameter (in inches)" },
    { name: "strokeLength", placeholder: "Stroke Length (in inches)" },
    { name: "strokesPerMinute", placeholder: "Strokes per Minute" },
  ],
  "Pump Flow Rate (Triplex Pump)": [
    { name: "cylinderDiameter", placeholder: "Cylinder Diameter (in inches)" },
    { name: "strokeLength", placeholder: "Stroke Length (in inches)" },
    { name: "strokesPerMinute", placeholder: "Strokes per Minute" },
  ],
  "Bottoms Up Time": [
    { name: "holeVolume", placeholder: "Hole Volume (in barrels)" },
    { name: "pumpFlowRate", placeholder: "Pump Flow Rate (in barrels per minute)" },
  ],
  "Surface to Surface Time": [
    { name: "pipeVolume", placeholder: "Pipe Volume (in barrels)" },
    { name: "pumpFlowRate", placeholder: "Pump Flow Rate (in barrels per minute)" },
  ],
  "Effective Mud Density (EMD)": [
    { name: "mudWeight", placeholder: "Mud Weight (in ppg)" },
    { name: "annularPressureLoss", placeholder: "Annular Pressure Loss (in psi)" },
    { name: "trueVerticalDepth", placeholder: "True Vertical Depth (in feet)" },
  ],
};

const unitMapping = {
  "Drill String Capacity": "cubic feet",
  "Oil-in-Place Calculations": "barrels",
  "Gas-in-Place Calculations": "standard cubic feet",
  "Drill Pipe Nozzle Calculation": "gallons per minute",
  "Annular Capacity": "cubic feet",
  "Equivalent Circulating Density (ECD)": "ppg",
  "Pump Flow Rate (Duplex Pump)": "gallons per minute",
  "Pump Flow Rate (Triplex Pump)": "gallons per minute",
  "Bottoms Up Time": "minutes",
  "Surface to Surface Time": "minutes",
  "Effective Mud Density (EMD)": "ppg",
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [selectedCalculation, setSelectedCalculation] = useState("");
  const [parameters, setParameters] = useState({});
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard"); // controls which section is visible
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // State for GP Calculator (weighted)
  const [gpCourses, setGpCourses] = useState([{ course: "", unit: "", grade: "" }]);
  const [calculatedGp, setCalculatedGp] = useState(null);

  // State for Reports (complaint)
  const [complaint, setComplaint] = useState("");

  // State for Settings (account update)
  const [settingsData, setSettingsData] = useState({ username: "", password: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
      try {
        const response = await axios.get("https://petrox-dashboard-backend.onrender.com/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setSettingsData({ username: response.data.username, password: "" });
      } catch (error) {
        alert("Error fetching user data");
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Dark mode toggle
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  // Navigation for various sections
  const handleRunCalculationsClick = () => {
    setActiveSection("calculation");
  };

  const handleProjectsClick = () => {
    // Navigate to projects page or implement folder creation logic
    navigate("/projects");
  };

  // Calculation handlers
  const handleCalculationChange = (e) => {
    setSelectedCalculation(e.target.value);
    setParameters({});
    setResult(null);
  };

  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunCalculation = () => {
    const parsedParams = Object.fromEntries(
      Object.entries(parameters).map(([key, value]) => [key, parseFloat(value) || 0])
    );
    let calculatedResult;
    switch (selectedCalculation) {
      case "Drill String Capacity":
        calculatedResult = (Math.PI / 4) * parsedParams.diameter ** 2 * parsedParams.length;
        break;
      case "Oil-in-Place Calculations":
        calculatedResult = parsedParams.area * parsedParams.thickness * parsedParams.porosity * (1 - parsedParams.saturation);
        break;
      case "Gas-in-Place Calculations":
        calculatedResult = parsedParams.volume / (parsedParams.zFactor * parsedParams.temperature);
        break;
      case "Drill Pipe Nozzle Calculation":
        calculatedResult = parsedParams.flowRate / (parsedParams.nozzleDiameter ** 2 * Math.sqrt(parsedParams.pressure));
        break;
      case "Annular Capacity":
        calculatedResult = (Math.PI / 4) * (parsedParams.outerDiameter ** 2 - parsedParams.innerDiameter ** 2) * parsedParams.length;
        break;
      case "Equivalent Circulating Density (ECD)":
        calculatedResult = parsedParams.mudWeight + parsedParams.pressure / (0.052 * parsedParams.depth);
        break;
      case "Pump Flow Rate (Duplex Pump)":
        calculatedResult = (parsedParams.cylinderDiameter ** 2 * Math.PI * parsedParams.strokeLength * parsedParams.strokesPerMinute) / 231;
        break;
      case "Pump Flow Rate (Triplex Pump)":
        calculatedResult = (3 * parsedParams.cylinderDiameter ** 2 * Math.PI * parsedParams.strokeLength * parsedParams.strokesPerMinute) / 231;
        break;
      case "Bottoms Up Time":
        calculatedResult = parsedParams.holeVolume / parsedParams.pumpFlowRate;
        break;
      case "Surface to Surface Time":
        calculatedResult = parsedParams.pipeVolume / parsedParams.pumpFlowRate;
        break;
      case "Effective Mud Density (EMD)":
        calculatedResult = parsedParams.mudWeight + parsedParams.annularPressureLoss / (0.052 * parsedParams.trueVerticalDepth);
        break;
      default:
        calculatedResult = "Calculation not yet implemented.";
        break;
    }
    if (typeof calculatedResult === "number") {
      calculatedResult = `${calculatedResult.toFixed(4)} ${unitMapping[selectedCalculation] || ""}`;
    }
    setResult(calculatedResult);
  };

  // GP Calculator functions
  const addGpCourse = () => {
    setGpCourses([...gpCourses, { course: "", unit: "", grade: "" }]);
  };

  const handleGpCourseChange = (index, field, value) => {
    const updatedCourses = [...gpCourses];
    updatedCourses[index][field] = value;
    setGpCourses(updatedCourses);
  };

  const calculateGp = () => {
    // Weighted GPA calculation: GPA = sum(grade_point * unit) / sum(unit)
    const gradeToPoint = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    let totalPoints = 0;
    let totalUnits = 0;
    for (const course of gpCourses) {
      const grade = course.grade.toUpperCase();
      const unit = parseFloat(course.unit);
      if (grade in gradeToPoint && !isNaN(unit)) {
        totalPoints += gradeToPoint[grade] * unit;
        totalUnits += unit;
      }
    }
    if (totalUnits === 0) {
      setCalculatedGp("Please enter valid unit loads for at least one course.");
      return;
    }
    const gpValue = totalPoints / totalUnits;
    setCalculatedGp(gpValue.toFixed(2));
  };

  // Report (complaint) form submission
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://petrox-dashboard-backend.onrender.com/api/report/", { complaint });
      alert("Complaint sent successfully.");
      setComplaint("");
    } catch (error) {
      alert("Error sending complaint.");
    }
  };

  // Settings update submission
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://petrox-dashboard-backend.onrender.com/api/settings/",
        settingsData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Settings updated successfully.");
      setUserData(response.data);
    } catch (error) {
      alert("Error updating settings.");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="content">
            <h2>Welcome, {userData.username}</h2>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role} Student</p>
          </div>
        );
      case "calculation":
        return (
          <div className="calculation-container">
            <h3>Select a Calculation</h3>
            <select value={selectedCalculation} onChange={handleCalculationChange}>
              <option value="">-- Select Calculation --</option>
              {Object.keys(calculationParameters).map((calc) => (
                <option key={calc} value={calc}>
                  {calc}
                </option>
              ))}
            </select>
            {selectedCalculation && (
              <div className="parameters-container">
                <h4>{selectedCalculation} Parameters</h4>
                {calculationParameters[selectedCalculation].map((param) => (
                  <input
                    key={param.name}
                    type="number"
                    name={param.name}
                    placeholder={param.placeholder}
                    value={parameters[param.name] || ""}
                    onChange={handleParameterChange}
                  />
                ))}
                <button
                  className="result_submit"
                  onClick={handleRunCalculation}
                  type="button"
                  style={{ margin: "10px" }}
                >
                  Calculate
                </button>
                {result && (
                  <b>
                    <p style={{ color: "#0056b3" }} className="result">
                      Result: {result}
                    </p>
                  </b>
                )}
              </div>
            )}
          </div>
        );
      case "gpCalculator":
        return (
          <div className="gp-calculator-container" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
            <h3>GP Calculator</h3>
            {gpCourses.map((courseObj, index) => (
              <div key={index} className="gp-course-row" style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder={`Course ${index + 1} Name`}
                  value={courseObj.course}
                  onChange={(e) =>
                    handleGpCourseChange(index, "course", e.target.value)
                  }
                  style={{ flex: "2", padding: "8px" }}
                />
                <input
                  type="number"
                  placeholder="Units"
                  value={courseObj.unit}
                  onChange={(e) =>
                    handleGpCourseChange(index, "unit", e.target.value)
                  }
                  style={{ flex: "1", padding: "8px" }}
                />
                <select
                  value={courseObj.grade}
                  onChange={(e) =>
                    handleGpCourseChange(index, "grade", e.target.value)
                  }
                  style={{ flex: "1", padding: "8px" }}
                >
                  <option value="">Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>
            ))}
            <button onClick={addGpCourse} style={{ margin: "10px" }}>
              Add Course
            </button>
            <button onClick={calculateGp} style={{ margin: "10px" }}>
              Calculate GPA
            </button>
            {calculatedGp && (
              <div className="gp-result" style={{ margin: "10px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                <h4>Your GPA: {calculatedGp}</h4>
              </div>
            )}
            <button onClick={() => setActiveSection("dashboard")} style={{ margin: "10px" }}>
              Close GP Calculator
            </button>
          </div>
        );
      case "reports":
        return (
          <div className="reports-container" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
            <h3>File a Complaint</h3>
            <form onSubmit={handleReportSubmit}>
              <textarea
                placeholder="Enter your complaint here..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                style={{ width: "100%", height: "100px", padding: "10px" }}
              />
              <button type="submit" style={{ margin: "10px" }}>
                Submit Complaint
              </button>
            </form>
          </div>
        );
      case "settings":
        return (
          <div className="settings-container" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
            <h3>Account Settings</h3>
            <form onSubmit={handleSettingsSubmit}>
              <label>Username:</label>
              <input
                type="text"
                value={settingsData.username}
                onChange={(e) => setSettingsData({ ...settingsData, username: e.target.value })}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />
              <label>Password:</label>
              <input
                type="password"
                value={settingsData.password}
                onChange={(e) => setSettingsData({ ...settingsData, password: e.target.value })}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />
              <button type="submit" style={{ margin: "10px" }}>
                Update Settings
              </button>
            </form>
          </div>
        );
      case "calendar":
        return (
          <div className="calendar-container" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
            <h3>Calendar</h3>
            {/* Replace the div below with your calendar component */}
            <div style={{ width: "100%", height: "400px", background: "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Beautiful Calendar Component Here
            </div>
          </div>
        );
      case "projects":
        handleProjectsClick();
        return null;
      default:
        return (
          <div className="content">
            <h2>Welcome, {userData.username}</h2>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role} Student</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
            fill="#FFFFFF"
          >
            <path d="M222-255q63-44 125-67.5T480-346q71 0 133.5 23.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm.66 370Q398-80 325-111.5t-127.5-86q-54.5-54.5-86-127.27Q80-397.53 80-480.27 80-563 111.5-635.5q31.5-72.5 86-127t127.27-86q72.76-31.5 155.5-31.5 82.73 0 155.23 31.5 72.5 31.5 127 86t86 127.03q31.5 72.53 31.5 155T848.5-325q-31.5 73-86 127.5t-127.03 86Q562.94-80 480.47-80Zm-.47-60q55 0 107.5-16T691-212q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480-140Zm0-370q34 0 55.5-21.5T557-587q0-34-21.5-55.5T480-664q-34 0-55.5 21.5T403-587q0 34 21.5 55.5T480-510Zm0-77Zm0 374Z" />
          </svg>
          <div className="info">
            <h2 className="name">{userData.username}</h2>
            <p className="role">{userData.role}</p>
          </div>
        </div>
        <div className="menu">
          <a
            href="#dashboard"
            className="menu-item"
            onClick={() => setActiveSection("dashboard")}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
            </svg>{" "}
            Dashboard
          </a>
          <a
            href="#projects"
            className="menu-item"
            onClick={() => setActiveSection("projects")}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z" />
            </svg>{" "}
            Projects
          </a>
          <a
            href="#calendar"
            className="menu-item"
            onClick={() => setActiveSection("calendar")}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-840h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
            </svg>{" "}
            Calendar
          </a>
          <a
            href="#gp-calculator"
            className="menu-item"
            onClick={() => {
              setActiveSection("gpCalculator");
            }}
          >
            <svg style={{ paddingRight: "5px" }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
              <path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z" />
            </svg>
            G P Calculator
          </a>
          <a
            href="#reports"
            className="menu-item"
            onClick={() => setActiveSection("reports")}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
            </svg>{" "}
            Reports
          </a>
          <a
            href="#settings"
            className="menu-item"
            onClick={() => setActiveSection("settings")}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
            </svg>{" "}
            Setting
          </a>
          <a
            href="#logout"
            className="menu-item"
            onClick={handleLogout}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
            </svg>{" "}
            Logout
          </a>
          <a
            href="#dark-mode"
            className="menu-item"
            onClick={handleToggleDarkMode}
          >
            <svg
              style={{ marginRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M480 960q-75 0-141-28.5T239 875q-17-12-2.5-31.5T258 833q48 27 108 27 64 0 116-44t58-106q0-64-42-106.5T480 556q-60 0-102 42T336 700q0 60 42 102t102 42q49 0 87-26.5t58-68.5q11-29-12.5-43.5T480 804q-42 0-71-29t-29-71q0-42 29-71t71-29q33 0 56.5 17t33.5 44q8 21-10.5 34.5T480 636q-30 0-51 21t-21 51q0 30 21 51t51 21q36 0 57-28t21-66q0-45-27-69.5T480 456q-37 0-63.5 26T390 556q0 37 26.5 63.5t63.5 26.5q45 0 69.5-27t24.5-64q0-45-24.5-73T480 396q-46 0-75.5 29T375 500q0 46 29.5 75t75.5 29q45 0 74.5-29T608 500q0-46-29-75T480 396Z" />
            </svg>
            Dark Mode
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <img className="petroxlogo" src={image} alt="petroxlogo" />
          <button onClick={handleRunCalculationsClick} type="button">
            RUN CALCULATIONS
          </button>
          {/* Additional dark mode toggle button could be added here if desired */}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
