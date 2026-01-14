import { NavLink } from "react-router-dom";



function QuickActions() {
  return (
  
      <div style={actionsCard}>
        <h3>Quick Actions</h3>
        <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <NavLink to="/" style={navLinkStyles}>
            Home
          </NavLink>
          <span style={{color: '#ccc'}}>|</span>
          <NavLink to="/timeLogs" style={navLinkStyles}>
            Log Hours
          </NavLink>
          <span style={{color: '#ccc'}}>|</span>
          <NavLink to="/meetings" style={navLinkStyles}>
            Meetings
          </NavLink>
          <span style={{color: '#ccc'}}>|</span>
          <NavLink to="/schedule" style={navLinkStyles}>
            Schedule
          </NavLink>
        </nav>

      </div>

  );
}
const actionsCard = {
  border: "solid 4px var(--color-accent)",
  backgroundColor: "var(--color-bg-secondary)",
  borderRadius: "12px",
  padding: "6px",
  width: "500px",
};

const navLinkStyles = ({ isActive }) => ({
  color: isActive ? "var(--color-text-secondary)" : "var(--color-text-primary)",
  textDecoration: "none",
  fontWeight: isActive ? "900" : "600",
  padding: "5px 10px",
  fontFamily: "Lora",
});

export default QuickActions;
