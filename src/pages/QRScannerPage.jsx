import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner"; // uses WebAssembly
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
} from "@mui/material";

// Required for QRScanner to work — move worker to public folder
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';

const QRScannerPage = () => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (!videoRef.current) return;

        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            if (result?.data) {
              try {
                const parsed = JSON.parse(result.data);
                setJsonData(parsed);
                setScannedData(JSON.stringify(parsed, null, 2));
              } catch {
                setJsonData(null);
                setScannedData(result.data);
              }
              scanner.stop(); // stop after scan
            }
          },
          {
            highlightScanRegion: true,
            returnDetailedScanResult: true,
          }
        );

        scannerRef.current = scanner;
        await scanner.start();
      } catch (err) {
        console.error(err);
        setError("Camera error: " + err.message);
      }
    };

    startScanner();

    return () => {
      scannerRef.current?.stop();
    };
  }, []);

  const handleRescan = () => {
    setScannedData("");
    setJsonData(null);
    scannerRef.current?.start().catch((err) => {
      setError("Restart failed: " + err.message);
    });
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            QR Code Scanner
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {error && <Alert severity="error">{error}</Alert>}

          {!scannedData ? (
            <video
              ref={videoRef}
              style={{ width: "100%", borderRadius: 8 }}
              muted
              playsInline
            />
          ) : (
            <>
              <Alert severity="success" sx={{ whiteSpace: "pre-wrap" }}>
                {scannedData}
              </Alert>
              {jsonData && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Parsed JSON:</Typography>
                  <pre style={{ textAlign: "left" }}>
                    {JSON.stringify(jsonData, null, 2)}
                  </pre>
                </Box>
              )}
              <Button onClick={handleRescan} variant="outlined" sx={{ mt: 2 }}>
                Scan Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default QRScannerPage;
