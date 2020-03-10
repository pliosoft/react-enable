import { FeatureContext } from "./index";
import React from "react";

// A GUI for toggling features that are configured by nearest `Features` parent.
// might be put into a floating window that can be mounted in a portal, and then
// dev users can toggle features.
export const ToggleFeatures: React.FC = () => {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const context = React.useContext(FeatureContext);

  if (context == null) {
    return null;
  }

  const { dispatch, state } = context;
  if (state.features.length === 0) {
    return null;
  }

  return (
    <aside
      className="feature-flags"
      style={{
        left: showDrawer ? "0" : "-198px",
        top: "100px",
        width: "220px",
        height: "300px",
        color: "black",
        background: "white",
        border: "1px solid gray",
        zIndex: 100000,
        opacity: showDrawer ? "1" : "0.6",
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        alignItems: "stretch",
        alignContent: "stretch"
      }}
    >
      <main
        style={{
          flexGrow: 1,
          padding: "12px",
          overflow: "scroll"
        }}
      >
        {state.features.map(feature => (
          <div key={feature.name}>
            <label>
              <input
                type="checkbox"
                onChange={() => {
                  dispatch({ type: "toggle", feature: feature.name });
                }}
                checked={state.active.has(feature.name)}
              />
              {feature.name}
            </label>
            {feature.description != null ? (
              <p
                style={{
                  marginTop: "0",
                  marginLeft: "1.5em",
                  fontSize: "0.5rem",
                  lineHeight: "0.5rem"
                }}
              >
                {feature.description}
              </p>
            ) : null}
          </div>
        ))}
      </main>
      <div
        style={{
          background: "rgb(238, 238, 238)",
          padding: "10px 0",
          writingMode: "vertical-rl",
          flexGrow: 0,
          width: "24px",
          display: "flex",
          flexDirection: "row",
          cursor: "pointer",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        onClick={() => setShowDrawer(!showDrawer)}
      >
        <button
          style={{
            border: "1px solid gray",
            fontSize: "110%",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {showDrawer ? "🎛 Hide" : "🎛 Show"}
        </button>
        <span>Dev Features Panel</span>
      </div>
    </aside>
  );
};
