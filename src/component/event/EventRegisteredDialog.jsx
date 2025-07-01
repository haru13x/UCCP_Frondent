import { Button, Card, CardActions, CardContent, Dialog, DialogContent } from "@mui/material";

 

 const EventRegisteredDialog = ({open, onClose}) => {
    return(
    <Dialog open={open} onClose={onClose} fullScreen>
        <DialogContent>
        <Card>
            <CardContent>
                Event
            </CardContent>
            <CardActions>
                <Button
                variant="outlined"
                color="error"
                onClick={onClose}
                >Close</Button>
            </CardActions>
        </Card>

        </DialogContent>
    </Dialog>);
 }
 export default EventRegisteredDialog;