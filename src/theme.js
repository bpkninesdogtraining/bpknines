import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#809a22',
      light: '#a5bd45',
      dark: '#5e7315',
      contrastText: '#f8f6f1',
    },
    secondary: {
      main: '#f1d11b',
      light: '#f6e06f',
      dark: '#d8b300',
      contrastText: '#27310f',
    },
    background: {
      default: '#f7f8fa',
      paper: 'rgba(255, 255, 255, 0.78)',
    },
    text: {
      primary: '#1d2823',
      secondary: '#5b6762',
    },
    divider: 'rgba(31, 74, 59, 0.12)',
  },
  typography: {
    fontFamily: '"Avenir Next", Avenir, "Avenir LT Std", "Segoe UI", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: '#16211d',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#16211d',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#16211d',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
      color: '#16211d',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#16211d',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.68,
    },
    body2: {
      letterSpacing: '-0.008em',
      lineHeight: 1.62,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.008em',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(180deg, #fcfdff 0%, #f4f7fb 42%, #eef2f6 100%)',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
        disableGutters: true,
      },
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '12px 24px',
          boxShadow: 'none',
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #93ad31 0%, #809a22 100%)',
          boxShadow: '0px 12px 28px rgba(94, 115, 21, 0.18)',
          '&:hover': {
            boxShadow: '0px 16px 34px rgba(94, 115, 21, 0.24)',
            backgroundImage: 'linear-gradient(135deg, #829a27 0%, #678018 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(128, 154, 34, 0.24)',
          '&:hover': {
            borderColor: 'rgba(128, 154, 34, 0.40)',
            backgroundColor: 'rgba(241, 209, 27, 0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.72)',
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 250, 253, 0.68) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0px 16px 40px rgba(20, 37, 54, 0.055)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
