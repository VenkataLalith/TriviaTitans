import React from "react";
import Link from '@mui/material/Link';


const AnalyticsDashboard = () => {
  const embedLink = 'https://lookerstudio.google.com/embed/reporting/977e3d60-2cf0-46bd-b541-918144aa5423/page/AR2YD';

  return (
    <div>
      <h1>User Statastics</h1>
      <p>
        Report Link: <Link href={embedLink}>User statistics</Link>
      </p>
    </div>  
    );
};

export default AnalyticsDashboard;
