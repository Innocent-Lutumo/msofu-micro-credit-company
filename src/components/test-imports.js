// Test file to verify all imports work correctly
console.log("Testing imports...");

try {
  // Test theme imports
  import("./common/themes.js").then(() => {
    console.log("✅ Themes imported successfully");
  }).catch(err => {
    console.error("❌ Themes import failed:", err);
  });

  // Test constants imports
  import("./common/constants.js").then(() => {
    console.log("✅ Constants imported successfully");
  }).catch(err => {
    console.error("❌ Constants import failed:", err);
  });

  // Test API service imports
  import("./services/apiService.js").then(() => {
    console.log("✅ API Service imported successfully");
  }).catch(err => {
    console.error("❌ API Service import failed:", err);
  });

  // Test hook imports
  import("./hooks/useApplicationData.js").then(() => {
    console.log("✅ useApplicationData hook imported successfully");
  }).catch(err => {
    console.error("❌ useApplicationData hook import failed:", err);
  });

  // Test layout components
  import("./layout/AppHeader.jsx").then(() => {
    console.log("✅ AppHeader imported successfully");
  }).catch(err => {
    console.error("❌ AppHeader import failed:", err);
  });

  import("./layout/LeftSidebar.jsx").then(() => {
    console.log("✅ LeftSidebar imported successfully");
  }).catch(err => {
    console.error("❌ LeftSidebar import failed:", err);
  });

  // Test dashboard components
  import("./dashboard/StatsCards.jsx").then(() => {
    console.log("✅ StatsCards imported successfully");
  }).catch(err => {
    console.error("❌ StatsCards import failed:", err);
  });

  // Test dialog components
  import("./dialogs/ProfileDialog.jsx").then(() => {
    console.log("✅ ProfileDialog imported successfully");
  }).catch(err => {
    console.error("❌ ProfileDialog import failed:", err);
  });

  import("./dialogs/AlertDialog.jsx").then(() => {
    console.log("✅ AlertDialog imported successfully");
  }).catch(err => {
    console.error("❌ AlertDialog import failed:", err);
  });

  import("./dialogs/ConfirmDialog.jsx").then(() => {
    console.log("✅ ConfirmDialog imported successfully");
  }).catch(err => {
    console.error("❌ ConfirmDialog import failed:", err);
  });

  console.log("All import tests completed!");

} catch (error) {
  console.error("❌ Import test failed:", error);
}
