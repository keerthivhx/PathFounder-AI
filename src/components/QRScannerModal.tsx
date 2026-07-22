import React, { useState, useEffect } from 'react';
import { QrCode, X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { SpatialNode } from '../types';

interface QRScannerModalProps {
  nodes: SpatialNode[];
  onCalibrateNode: (node: SpatialNode) => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  nodes,
  onCalibrateNode,
  onClose,
}) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'sample'>('sample');

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (activeTab === 'camera') {
      html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCode
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleDecodedQR(decodedText);
            html5QrCode?.stop();
          },
          () => {}
        )
        .catch(err => {
          setErrorMsg('Camera access unavailable. Select a sample QR below.');
        });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [activeTab]);

  const handleDecodedQR = (qrText: string) => {
    setScanResult(qrText);
    const matched = nodes.find(n => n.qrCodeId.toLowerCase() === qrText.toLowerCase() || n.id.toLowerCase() === qrText.toLowerCase());

    if (matched) {
      onCalibrateNode(matched);
    } else {
      setErrorMsg(`Unrecognized QR code: ${qrText}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-100">QR Location Anchor</h2>
            <p className="text-xs text-slate-400">Scan wall QR to calibrate your exact position</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('sample')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sample' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Building QR Anchors
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'camera' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Camera Scan
          </button>
        </div>

        {/* Tab 1: Live Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            <div id="qr-reader" className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 min-h-[220px]"></div>
            {errorMsg && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Sample Building QR Anchors */}
        {activeTab === 'sample' && (
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            <p className="text-xs text-slate-400 mb-2">
              Select any wall QR code installed inside the building to calibrate origin:
            </p>
            {nodes.map(node => (
              <div
                key={node.id}
                onClick={() => handleDecodedQR(node.qrCodeId)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/60 hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200">{node.name}</p>
                  <p className="text-xs text-slate-400">Floor {node.floor} • ID: {node.qrCodeId}</p>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                  Calibrate
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Banner */}
        {scanResult && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Position successfully calibrated via {scanResult}!</span>
          </div>
        )}
      </div>
    </div>
  );
};
