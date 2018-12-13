import React from 'react';
import { Download } from 'react-feather';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Loading } from '../Loading';
import { CustomDocument } from './Document';

interface PDFDownloadLinkRenderProps {
  loading: boolean;
}

export const DownloadIcon = () => (
  <div className="download">
    <Download />
    <p>Download PDF</p>
    <style jsx>{`
      .download {
        font-family: 'PT Sans Caption', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      p {
        margin-top: 0.5em;
      }
    `}</style>
  </div>
);

export const render = ({ loading }: PDFDownloadLinkRenderProps) =>
  loading ? <Loading /> : <DownloadIcon />;

export const PDFLink = () => (
  <div>
    <PDFDownloadLink document={CustomDocument} fileName="somename.pdf">
      {render}
    </PDFDownloadLink>
  </div>
);