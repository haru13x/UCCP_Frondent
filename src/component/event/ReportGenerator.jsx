import React, { useRef } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportGenerator = ({ eventData }) => {
  const reportRef = useRef();

  const genderCounts = eventData.reduce(
    (acc, item) => {
      item.gender === 'male' ? acc.male++ : acc.female++;
      return acc;
    },
    { male: 0, female: 0 }
  );

  const ageData = eventData.reduce((acc, item) => {
    const age = item.age;
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('event-report.pdf');
  };

  return (
    <div>
      <div ref={reportRef} style={{ padding: 20, backgroundColor: '#fff' }}>
        <h2>Event Report</h2>
        <p>From: {eventData[0]?.start_date} — To: {eventData[0]?.end_date}</p>

        <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Organizer</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((event, idx) => (
              <tr key={idx}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.status === 1 ? 'Active' : 'Cancelled'}</td>
                <td>{event.organizer?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Gender Distribution</h3>
        <Pie
          data={{
            labels: ['Male', 'Female'],
            datasets: [
              {
                data: [genderCounts.male, genderCounts.female],
                backgroundColor: ['#36A2EB', '#FF6384'],
              },
            ],
          }}
        />

        <h3>Age vs Attendance</h3>
        <Bar
          data={{
            labels: Object.keys(ageData),
            datasets: [
              {
                label: 'Attendees by Age',
                data: Object.values(ageData),
                backgroundColor: '#4CAF50',
              },
            ],
          }}
        />
      </div>

      <button onClick={handleDownloadPDF}>Download Report as PDF</button>
    </div>
  );
};

export default ReportGenerator;
