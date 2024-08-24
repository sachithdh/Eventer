import { Grid, Box, Typography, IconButton, Link } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export const Footer = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                {/* Your main content here */}
            </Box>
            <Grid container sx={{
                bgcolor: "#673ab7",
                minHeight: "250px",
                position: 'relative',
                bottom: 0,
                width: '100%',
                color: '#f5f5f5',
                padding: '40px',
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            }}>
                <Grid item xs={12} md={4} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Eventer
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Organize your Event
                    </Typography>
                    <Box>
                        <IconButton color="inherit" aria-label="Facebook">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="Twitter">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="Instagram">
                            <InstagramIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="LinkedIn">
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Quick Links
                    </Typography>
                    <Link href="/home" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#3f51b5' } }}>
                        Home
                    </Link>
                    <Link href="/about" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#3f51b5' } }}>
                        About Us
                    </Link>
                    <Link href="/contact" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#3f51b5' } }}>
                        Contact
                    </Link>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Contact Us
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        123 Reid Avenue, Suite 100
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Colombo, Sri Lanka
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Phone: (123) 456-7890
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Email: info@eventer.com
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ borderTop: '1px solid #333', pt: 2, mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Eventer. All rights reserved.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}