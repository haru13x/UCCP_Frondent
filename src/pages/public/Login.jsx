// src/pages/Login.jsx
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Container,
  Grid
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { School, Security, People, Church, Event } from "@mui/icons-material";
import TopBar from "../../component/TopBar";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "../../component/event/SnackbarProvider ";
import { Link } from "react-router-dom";

export default function Login() {
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load saved email if "remember me" was used
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    const savedPassword = localStorage.getItem("remember_password");
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { email, password };
      const res = await UseMethod("post", "login", payload);

      if (res && res.status === 200) {
        const { api_token, user } = res.data;
       
        localStorage.setItem("api_token", api_token);
        localStorage.setItem("user", JSON.stringify(user));

        // Dispatch custom event to notify other components of user data update
        window.dispatchEvent(new CustomEvent('userDataUpdated'));

        if (rememberMe) {
          localStorage.setItem("remember_email", email);
          localStorage.setItem("remember_password", password);
        } else {
          localStorage.removeItem("remember_email");
          localStorage.removeItem("remember_password");
        }

        showSnackbar({ message: "🎉 Welcome back! Login successful!", type: "success" });
        navigate("/list");
      } else {
        showSnackbar({
          message: res.data?.msg || "❌ Invalid credentials. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.msg || "⚠️ Login failed. Please check your connection.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, padding: 0 }}>
          <Grid container sx={{ minHeight: "95vh" }}>

            {/* Left Side - Welcome Section */}
            <Grid size={{md:6}} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, md: 6 }, pr: { md: 8 } }}>
              <Box sx={{ textAlign: "center", color: "white", maxWidth: 500 }}>
                <Box sx={{ mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      margin: "0 auto 24px",
                      background: "linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                      border: "3px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Church sx={{ fontSize: 60, color: "white" }} />
                  </Avatar>
                </Box>
                
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Welcome to UCCP
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  UCCP Church Event Management System
                </Typography>
                
                <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 4 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Security sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Secure Access</Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <People sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Community</Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Event sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Event</Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,
                    fontStyle: "italic",
                    maxWidth: 400,
                    margin: "0 auto",
                  }}
                >
                  "Building faith, fostering community, and creating meaningful connections through organized events and activities."
                </Typography>
              </Box>
            </Grid>
            
            {/* Right Side - Login Form */}
             <Grid size={{md:6}} item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, md: 1 }, pl: { md: 9 } }}>
               <Card
                 elevation={0}
                 sx={{
                   width: "100%",
                   maxWidth: 580,
                   borderRadius: 5,
                   background: "rgba(255, 255, 255, 0.98)",
                   backdropFilter: "blur(25px)",
                   border: "1px solid rgba(255, 255, 255, 0.3)",
                   boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1) inset",
                   transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                   position: "relative",
                   overflow: "hidden",
                 
                   "&:hover": {
                     transform: "translateY(-3px) scale(1.01)",
                     boxShadow: "0 35px 70px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2) inset",
                   },
                  
                 }}
               >
                <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
                  {/* Modern Header */}
                   <Box sx={{ textAlign: "center", mb: 2 }}>
                     
                     <Typography
                       component="h1"
                       variant="h4"
                       sx={{
                         fontWeight: 800,
                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                         backgroundSize: "200% 200%",
                         backgroundClip: "text",
                         WebkitBackgroundClip: "text",
                         WebkitTextFillColor: "transparent",
                         animation: "textGradient 3s ease infinite",
                         mb: 2,
                         letterSpacing: "-0.02em",
                         "@keyframes textGradient": {
                           "0%, 100%": { backgroundPosition: "0% 50%" },
                           "50%": { backgroundPosition: "100% 50%" },
                         },
                       }}
                     >
                       Welcome Back
                     </Typography>
                     <Typography
                       variant="h7"
                       sx={{
                         color: "#64748b",
                         fontWeight: 400,
                         opacity: 0.8,
                         letterSpacing: "0.01em",
                       }}
                     >
                       Sign in to your UCCP account
                     </Typography>
                   </Box>

                  {/* Modern Form */}
                   <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                       margin="normal"
                       required
                       fullWidth
                       id="email"
                       label="Email Address"
                       name="email"
                       autoComplete="email"
                       autoFocus
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="your.email@uccp.org"
                       sx={{
                         mb: 1,
                         "& .MuiOutlinedInput-root": {
                           borderRadius: 4,
                           backgroundColor: "rgba(248, 250, 252, 0.8)",
                           backdropFilter: "blur(10px)",
                           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                           height: "56px",
                           "& fieldset": {
                             borderColor: "rgba(102, 126, 234, 0.15)",
                             borderWidth: "1.5px",
                           },
                           "&:hover": {
                             backgroundColor: "rgba(102, 126, 234, 0.04)",
                             transform: "translateY(-1px)",
                             boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
                             "& fieldset": {
                               borderColor: "#667eea",
                             },
                           },
                           "&.Mui-focused": {
                             backgroundColor: "rgba(102, 126, 234, 0.06)",
                             transform: "translateY(-1px)",
                             boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)",
                             "& fieldset": {
                               borderColor: "#667eea",
                               borderWidth: "2px",
                             },
                           },
                         },
                         "& .MuiInputLabel-root": {
                           color: "#64748b",
                           fontWeight: 500,
                           "&.Mui-focused": {
                             color: "#667eea",
                           },
                         },
                         "& .MuiOutlinedInput-input": {
                           fontSize: "1rem",
                           fontWeight: 400,
                         },
                       }}
                     />
                    <TextField
                       margin="normal"
                       required
                       fullWidth
                       name="password"
                       label="Password"
                       type={showPassword ? "text" : "password"}
                       id="password"
                       autoComplete="current-password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       InputProps={{
                         endAdornment: (
                           <InputAdornment position="end">
                             <IconButton
                               aria-label="toggle password visibility"
                               onClick={() => setShowPassword(!showPassword)}
                               edge="end"
                               sx={{
                                 color: "#64748b",
                                 transition: "all 0.2s ease",
                                 "&:hover": {
                                   color: "#667eea",
                                   backgroundColor: "rgba(102, 126, 234, 0.1)",
                                   transform: "scale(1.1)",
                                 },
                               }}
                             >
                               {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                             </IconButton>
                           </InputAdornment>
                         ),
                       }}
                       sx={{
                         mb: 4,
                         "& .MuiOutlinedInput-root": {
                           borderRadius: 4,
                           backgroundColor: "rgba(248, 250, 252, 0.8)",
                           backdropFilter: "blur(10px)",
                           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                           height: "56px",
                           "& fieldset": {
                             borderColor: "rgba(102, 126, 234, 0.15)",
                             borderWidth: "1.5px",
                           },
                           "&:hover": {
                             backgroundColor: "rgba(102, 126, 234, 0.04)",
                             transform: "translateY(-1px)",
                             boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
                             "& fieldset": {
                               borderColor: "#667eea",
                             },
                           },
                           "&.Mui-focused": {
                             backgroundColor: "rgba(102, 126, 234, 0.06)",
                             transform: "translateY(-1px)",
                             boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)",
                             "& fieldset": {
                               borderColor: "#667eea",
                               borderWidth: "2px",
                             },
                           },
                         },
                         "& .MuiInputLabel-root": {
                           color: "#64748b",
                           fontWeight: 500,
                           "&.Mui-focused": {
                             color: "#667eea",
                           },
                         },
                         "& .MuiOutlinedInput-input": {
                           fontSize: "1rem",
                           fontWeight: 400,
                         },
                       }}
                     />

                    {/* Remember Me & Forgot Password */}
                     <Box
                       sx={{
                         display: "flex",
                         justifyContent: "space-between",
                         alignItems: "center",
                         mb: 2,
                       }}
                     >
                       <FormControlLabel
                         control={
                           <Checkbox
                             value="remember"
                             color="primary"
                             checked={rememberMe}
                             onChange={(e) => setRememberMe(e.target.checked)}
                             sx={{
                               color: "rgba(102, 126, 234, 0.5)",
                               transition: "all 0.2s ease",
                               "&.Mui-checked": {
                                 color: "#667eea",
                               },
                               "&:hover": {
                                 backgroundColor: "rgba(102, 126, 234, 0.08)",
                                 transform: "scale(1.05)",
                               },
                             }}
                           />
                         }
                         label={
                           <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>
                             Remember me
                           </Typography>
                         }
                       />
                       <Typography
                         variant="body2"
                         sx={{
                           color: "#667eea",
                           cursor: "pointer",
                           fontSize: "0.9rem",
                           fontWeight: 600,
                           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                           position: "relative",
                           "&::after": {
                             content: '""',
                             position: "absolute",
                             bottom: "-2px",
                             left: 0,
                             width: "0%",
                             height: "2px",
                             background: "linear-gradient(90deg, #667eea, #764ba2)",
                             transition: "width 0.3s ease",
                           },
                           "&:hover": {
                             color: "#5a67d8",
                             transform: "translateY(-1px)",
                             "&::after": {
                               width: "100%",
                             },
                           },
                         }}
                       >
                         Forgot Password?
                       </Typography>
                     </Box>

                    {/* Modern Submit Button */}
                     <Button
                       type="submit"
                       fullWidth
                       variant="contained"
                       disabled={isLoading}
                       sx={{
                         py: 1,
                         borderRadius: 4,
                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                         backgroundSize: "200% 200%",
                         fontSize: "1.1rem",
                         fontWeight: 700,
                         textTransform: "none",
                         letterSpacing: "0.02em",
                         boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
                         transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                         position: "relative",
                         overflow: "hidden",
                         "&::before": {
                           content: '""',
                           position: "absolute",
                           top: 0,
                           left: "-100%",
                           width: "100%",
                           height: "50%",
                           background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                           transition: "left 0.6s ease",
                         },
                         "&:hover": {
                           transform: "translateY(-3px) scale(1.02)",
                           backgroundPosition: "100% 100%",
                           boxShadow: "0 20px 40px rgba(102, 126, 234, 0.5), 0 0 0 1px rgba(255,255,255,0.2) inset",
                           "&::before": {
                             left: "100%",
                           },
                         },
                         "&:active": {
                           transform: "translateY(-1px) scale(0.98)",
                         },
                         "&:disabled": {
                           background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                           transform: "none",
                           boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                           color: "#64748b",
                         },
                       }}
                     >
                       {isLoading ? "Signing In..." : "Sign In to UCCP"}
                     </Button>

                    {/* Register Link */}
                     <Box
                       sx={{
                         mt: 1,
                         pt: 4,
                         borderTop: "1px solid rgba(102, 126, 234, 0.08)",
                         textAlign: "center",
                       }}
                     >
                       <Typography variant="body2" sx={{ color: "#64748b", mb: 3, fontSize: "0.95rem", fontWeight: 400 }}>
                         Don't have an account yet?
                       </Typography>
                       <Button
                         variant="outlined"
                         fullWidth
                         sx={{
                           borderColor: "rgba(102, 126, 234, 0.25)",
                           color: "#667eea",
                           borderRadius: 4,
                           py: 2,
                           fontWeight: 600,
                           fontSize: "1rem",
                           textTransform: "none",
                           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                           position: "relative",
                           overflow: "hidden",
                           "&::before": {
                             content: '""',
                             position: "absolute",
                             top: 0,
                             left: 0,
                             right: 0,
                             bottom: 0,
                             background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                             opacity: 0,
                             transition: "opacity 0.3s ease",
                           },
                           "&:hover": {
                             borderColor: "#667eea",
                             color: "#5a67d8",
                             transform: "translateY(-2px)",
                             boxShadow: "0 8px 20px rgba(102, 126, 234, 0.2)",
                             "&::before": {
                               opacity: 1,
                             },
                           },
                         }}
                         onClick={() => navigate("/register")}
                       >
                         Request New Account
                       </Button>
                     </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
    </>
  );
}