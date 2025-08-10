// Tosoh navigation mock data
const mockHeader = {
  mainNavigationMenu: {
    children: [
      {
        label: "Home",
        url: "/",
        children: []
      },
      {
        label: "Productivity",
        url: "/productivity",
        children: [
          {
            label: "Laboratory Solutions",
            url: "/productivity/laboratory-solutions",
            children: [
              {
                label: "HPLC Systems",
                url: "/productivity/laboratory-solutions/hplc-systems"
              },
              {
                label: "Mass Spectrometry",
                url: "/productivity/laboratory-solutions/mass-spectrometry"
              },
              {
                label: "Chromatography Columns",
                url: "/productivity/laboratory-solutions/chromatography-columns"
              }
            ]
          },
          {
            label: "Clinical Diagnostics",
            url: "/productivity/clinical-diagnostics",
            children: [
              {
                label: "Immunoassay Systems",
                url: "/productivity/clinical-diagnostics/immunoassay"
              },
              {
                label: "Chemistry Analyzers",
                url: "/productivity/clinical-diagnostics/chemistry"
              }
            ]
          }
        ]
      },
      {
        label: "Efficiency",
        url: "/efficiency",
        children: [
          {
            label: "Automation Solutions",
            url: "/efficiency/automation",
            children: []
          },
          {
            label: "Sample Handling",
            url: "/efficiency/sample-handling",
            children: []
          }
        ]
      },
      {
        label: "Connectivity",
        url: "/connectivity",
        children: [
          {
            label: "Data Management",
            url: "/connectivity/data-management",
            children: []
          },
          {
            label: "Cloud Integration",
            url: "/connectivity/cloud",
            children: []
          }
        ]
      },
      {
        label: "Video",
        url: "/video",
        children: []
      },
      {
        label: "Support",
        url: "/support",
        children: [
          {
            label: "Technical Support",
            url: "/support/technical",
            children: []
          },
          {
            label: "Training",
            url: "/support/training",
            children: []
          },
          {
            label: "Documentation",
            url: "/support/documentation",
            children: []
          }
        ]
      },
      {
        label: "Specifications",
        url: "/specifications",
        children: []
      },
      {
        label: "Contact",
        url: "/contact"
        // No children property - completely childless
      },
      {
        label: "Login",
        url: "/login"
        // No children property - completely childless
      }
    ]
  }
};

// Set up the window object
declare global {
  interface Window {
    Tosoh: {
      Header: {
        mainNavigationMenu: typeof mockHeader.mainNavigationMenu;
      };
    };
  }
}

window.Tosoh = window.Tosoh || {};
window.Tosoh.Header = mockHeader;

export default mockHeader;
