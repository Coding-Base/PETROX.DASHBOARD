import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import image from "./Logo.png";
// import profile from "./userlogo.png";
// import cal2 from "./cal2.png";
// import cal3 from "./cal3.png";

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
  const [isCalculationVisible, setIsCalculationVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
      try {
        const response = await axios.get("http://localhost:8000/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        alert("Error fetching user data");
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleRunCalculationsClick = () => {
    setIsCalculationVisible(true);
  };

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
        calculatedResult =
          (Math.PI / 4) * parsedParams.diameter ** 2 * parsedParams.length;
        break;
      case "Oil-in-Place Calculations":
        calculatedResult =
          parsedParams.area *
          parsedParams.thickness *
          parsedParams.porosity *
          (1 - parsedParams.saturation);
        break;
      case "Gas-in-Place Calculations":
        calculatedResult =
          parsedParams.volume / (parsedParams.zFactor * parsedParams.temperature);
        break;
      case "Drill Pipe Nozzle Calculation":
        calculatedResult =
          parsedParams.flowRate /
          (parsedParams.nozzleDiameter ** 2 * Math.sqrt(parsedParams.pressure));
        break;
      case "Annular Capacity":
        calculatedResult =
          (Math.PI / 4) *
          (parsedParams.outerDiameter ** 2 - parsedParams.innerDiameter ** 2) *
          parsedParams.length;
        break;
      case "Equivalent Circulating Density (ECD)":
        calculatedResult =
          parsedParams.mudWeight +
          parsedParams.pressure / (0.052 * parsedParams.depth);
        break;
      case "Pump Flow Rate (Duplex Pump)":
        calculatedResult =
          (parsedParams.cylinderDiameter ** 2 *
            Math.PI *
            parsedParams.strokeLength *
            parsedParams.strokesPerMinute) /
          231;
        break;
      case "Pump Flow Rate (Triplex Pump)":
        calculatedResult =
          (3 *
            parsedParams.cylinderDiameter ** 2 *
            Math.PI *
            parsedParams.strokeLength *
            parsedParams.strokesPerMinute) /
          231;
        break;
      case "Bottoms Up Time":
        calculatedResult = parsedParams.holeVolume / parsedParams.pumpFlowRate;
        break;
      case "Surface to Surface Time":
        calculatedResult = parsedParams.pipeVolume / parsedParams.pumpFlowRate;
        break;
      case "Effective Mud Density (EMD)":
        calculatedResult =
          parsedParams.mudWeight +
          parsedParams.annularPressureLoss /
            (0.052 * parsedParams.trueVerticalDepth);
        break;
      default:
        calculatedResult = "Calculation not yet implemented.";
        break;
    }

    if (typeof calculatedResult === "number") {
      calculatedResult = `${calculatedResult.toFixed(4)} ${
        unitMapping[selectedCalculation] || ""
      }`;
    }

    setResult(calculatedResult);
  };

  if (!userData) {
    return (
      <div className="container">
        <img src={image} alt="logo" />
      </div>
    );
  }

  const requiredParameters = calculationParameters[selectedCalculation] || [];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile">
          {/* <img className="profile-picture" src={profile} alt="Profile" /> */}
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M222-255q63-44 125-67.5T480-346q71 0 133.5 23.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm.66 370Q398-80 325-111.5t-127.5-86q-54.5-54.5-86-127.27Q80-397.53 80-480.27 80-563 111.5-635.5q31.5-72.5 86-127t127.27-86q72.76-31.5 155.5-31.5 82.73 0 155.23 31.5 72.5 31.5 127 86t86 127.03q31.5 72.53 31.5 155T848.5-325q-31.5 73-86 127.5t-127.03 86Q562.94-80 480.47-80Zm-.47-60q55 0 107.5-16T691-212q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480-140Zm0-370q34 0 55.5-21.5T557-587q0-34-21.5-55.5T480-664q-34 0-55.5 21.5T403-587q0 34 21.5 55.5T480-510Zm0-77Zm0 374Z"/></svg>
          <div className="info">
            <h2 className="name">{userData.username}</h2>
            <p className="role">{userData.role}</p>
          </div>
        </div>
        <div className="menu">
          <a href="#home" className="menu-item active">
          <svg style={{marginRight:'5px'}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg> Dashboard
          </a>
          <a href="#project" className="menu-item">
          <svg style={{marginRight:'5px'}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/></svg>
           Projects
          </a>
          <a href="#calendar" className="menu-item">
          <svg style={{marginRight:'5px'}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg> Calendar
          </a>
          <a href="#tasks" className="menu-item">
          <svg style={{marginRight:'5px'}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg> Tests
          </a>
          <a href="#reports" className="menu-item">
          <svg style={{marginRight:'5px'}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg> Setting
          </a>
          <a href="#reports" className="menu-item">
          <svg style={{marginRight:'5px'}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg> Reports
          </a>
          <a href="#reports" className="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/></svg> Verify
          </a>
          <a href="#calendar" className="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg> Logout
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
          {/* <button style={{marginLeft:'10%', marginRight:'20%' }} className="logout">Logout</button> */}
        </div>
        <div className="content">
          <h2>Welcome, {userData.username}</h2>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role} Student</p>
          
          {isCalculationVisible && (
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
                  {requiredParameters.map((param) => (
                    <input
                      key={param.name}
                      type="number"
                      name={param.name}
                      placeholder={param.placeholder}
                      value={parameters[param.name] || ""}
                      onChange={handleParameterChange}
                    />
                  ))}
                  <button className="result_submit" onClick={handleRunCalculation} type="button">
                    Calculate
                  </button>
                  {result && <b><p style={{color:'#0056b3'}} className="result">Result: {result}</p></b>}
                </div>
              )}
            </div>
            
          )}
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className="cal">
            {/* <img src={cal3} alt="cal" className="cal" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#302AF3"><path d="M160-120q-12 0-21-9t-9-21.5q0-12.5 9-21t21-8.5h40v-270h-50q-12 0-21-9t-9-21.5q0-12.5 9-21t21-8.5h50v-270h-40q-12 0-21-9t-9-21.5q0-12.5 9-21t21-8.5h640q12.75 0 21.38 8.62Q830-822.75 830-810q0 12-8.62 21-8.63 9-21.38 9h-40v270h50q12.75 0 21.38 8.62Q840-492.75 840-480q0 12-8.62 21-8.63 9-21.38 9h-50v270h40q12.75 0 21.38 8.62Q830-162.75 830-150q0 12-8.62 21-8.63 9-21.38 9H160Zm100-60h440v-270q-12 0-21-9t-9-21.5q0-12.5 9-21t21-8.5v-270H260v270q12.75 0 21.38 8.62Q290-492.75 290-480q0 12-8.62 21-8.63 9-21.38 9v270Zm220.12-153Q526-333 558-364.64q32-31.65 32-76.59Q590-477 569.5-502T480-607q-69 79-89.5 104.5T370-441.23q0 44.94 32.12 76.59 32.12 31.64 78 31.64ZM260-180v-600 600Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#302AF3"><path d="M402-240v-60h59l121-139-121-141h-74l-71 366q-8 45-34 69.5T215-120q-41 0-68.5-24T119-204q0-27 15-43.5t39-16.5q21 0 34.5 12t13.5 32q0 11-4.5 20.5T204-184q4 2 8.5 3t9.5 1q13 0 22-12.5t13-32.5l69-355H200v-60h137l21-106q9-45 36-69.5t67-24.5q41 0 67.5 24t26.5 60q0 27-15 43.5T501-696q-20 0-34-11.5T453-738q0-10 4-19.5t10-15.5q-2-2-6-3.5t-8-1.5q-13 0-22.5 12T417-735l-18 95h189v60h-47l83 96 78-96h-48v-60h186v60h-58L662-439l120 139h58v60H654v-60h48l-80-93-82 93h48v60H402Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#302AF3"><path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#302AF3"><path d="M240-160v-63l275-257-275-257v-63h480v100H396l235 220-235 220h324v100H240Z"/></svg>
            {/* <img src={cal2} alt="cal" className="cal" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

