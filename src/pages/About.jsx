// src/pages/About.jsx
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  CardMedia,
} from "@mui/material";
import ChurchIcon from "@mui/icons-material/Church";
import TopBar from "../component/TopBar";

const About = () => {

  const pastors = [
    {
      name: "Rev. Maria Santos",
      role: "Senior Pastor",
      photo: "/assets/pastor1.jpg",
    },
    {
      name: "Rev. Joel Ramirez",
      role: "Associate Pastor",
      photo: "/assets/pastor2.jpg",
    },
    {
      name: "Rev. Liza Manalo",
      role: "Youth Minister",
      photo: "/assets/pastor3.jpg",
    },
  ];

  const events = [
    { title: "Youth Camp 2024", image: "/assets/youth-camp.jpg" },
    { title: "Bible Study Fellowship", image: "/assets/bible-study.jpg" },
    { title: "Community Outreach", image: "/assets/outreach.jpg" },
  ];

  return (
     <>
     <TopBar />
    <Box bgcolor="" minHeight="100vh" py={6} sx={{ backgroundImage: `url('/login1.jpg')`,
          backgroundSize: 'cover',
    backgroundPosition: 'center',}}>
      <Container maxWidth="">
        <Box textAlign="center" mb={5}>
          <ChurchIcon sx={{ fontSize: 60, color: "#0d47a1" }} />
          <Typography variant="h4" fontWeight="bold" color="primary.dark" gutterBottom>
              United Church of Christ in the Philippines 
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            United Church of Christ in the Philippines – Bringing people closer to Christ through worship, service, and digital innovation.
          </Typography>
        </Box>

        {/* Who We Are */}
        <Card sx={{    background: "linear-gradient(to bottom right,rgb(222, 239, 250),rgb(255, 255, 255))", mb: 4, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'scale(1.01)', boxShadow: 6 } }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Who We Are
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The United Church of Christ in the Philippines (UCCP) is a Protestant denomination rooted in the spirit of unity and service. Our mission is to glorify God by proclaiming the gospel, helping the needy, and nurturing faithful disciples in every Filipino community.
            </Typography>
          </CardContent>
           <CardContent>
                <Typography variant="h6" fontWeight="bold">Our Vision</Typography>
                <Typography variant="body2" color="text.secondary">
                  A Christ-centered, united, and caring church community actively transforming society through compassion and justice.
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Our Mission</Typography>
                <Typography variant="body2" color="text.secondary">
                  To serve God and people by spreading the Gospel, building strong communities, and responding to social needs with love and faith.
                </Typography>
              </CardContent>
        </Card>
  {/* Meet Our Pastors */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Meet Our Pastors
        </Typography>
        <Grid  container spacing={3} mb={6}>
          {pastors.map((pastor, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card
                sx={{
                  textAlign: "center",
                  py: 3,
                  px:3,
                  background: "linear-gradient(to bottom right,rgb(222, 239, 250),rgb(255, 255, 255))",
                  transition: "0.3s",
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                }}
              >
                <Avatar
                  src={pastor.photo}
                  alt={pastor.name}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
                />
                <Typography fontWeight="bold">{pastor.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {pastor.role}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Our Mission & Vision */}
      
          
     

      
        {/* Church Event Gallery
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Church Events Gallery
        </Typography>
        <Grid container spacing={3} mb={6}>
          {events.map((event, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card
                sx={{
                      background: "linear-gradient(to bottom right,rgb(222, 239, 250),rgb(255, 255, 255))",
                    px:3,
                    py:2,
                  transition: "0.3s",
                  '&:hover': {
                    transform: 'scale(1.04)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent>
                  <Typography fontWeight="bold">{event.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid> */}

        {/* Event Management System Info */}
        <Card sx={{ backgroundColor: "#bbdefb", py: 3, px: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              About Our Event Management System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The UCCP Event Management System is designed to help our congregation organize, manage, and attend events with ease. Whether it's a Bible study, youth camp, or charity outreach, our system ensures that everything is accessible, trackable, and inclusive. It reflects our commitment to modern service for spiritual growth.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
   </>
  );
};

export default About;
