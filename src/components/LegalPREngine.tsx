import React, { useState } from 'react';
import { FileText, Copy, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const crisisTypes = [
  { 
    id: 'data-breach', 
    label: 'Data Breach', 
    description: 'Security incident involving unauthorized access to sensitive data',
    template: `# Official Statement: Data Security Incident

We are actively addressing a data security incident that was recently identified in our systems. Our immediate priorities are:

1. 🔒 Protecting customer data
2. 🔍 Conducting a thorough investigation
3. 📱 Maintaining transparent communication

## Immediate Actions

- Engaged cybersecurity experts
- Implemented additional security measures
- Established dedicated response team

## Our Commitment

We remain committed to:
- Complete transparency
- Regular updates
- Enhanced security measures

For inquiries: press@company.com
Emergency hotline: +1-XXX-XXX-XXXX`
  },
  { 
    id: 'product-recall', 
    label: 'Product Recall', 
    description: 'Issues requiring withdrawal of products from the market',
    template: `# Important Product Safety Notice

We are initiating a voluntary recall of [Product Name] due to [Brief Issue Description].

## Key Information

🔍 Affected Products:
- Model numbers: XXX-XXX
- Manufacturing dates: MM/YYYY - MM/YYYY

⚠️ Safety Instructions:
1. Immediately discontinue use
2. Secure the product
3. Contact our support team

## Our Response

We are:
- Providing free replacements
- Covering all associated costs
- Implementing enhanced quality controls

📞 Contact: support@company.com
Recall Hotline: +1-XXX-XXX-XXXX`
  },
  { 
    id: 'executive-misconduct', 
    label: 'Executive Misconduct', 
    description: 'Ethical or legal violations by leadership',
    template: `# Statement on Leadership Changes

The Board of Directors announces important changes in our executive leadership structure.

## Immediate Actions

We have:
1. Appointed an interim leadership team
2. Initiated a comprehensive review
3. Enhanced governance protocols

## Moving Forward

Our commitment to:
- Ethical leadership
- Corporate governance
- Stakeholder trust

## Contact

Media Relations: media@company.com
Investor Relations: ir@company.com`
  },
];

export function LegalPREngine() {
  const [selectedType, setSelectedType] = useState(crisisTypes[0]);
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResponse(selectedType.template);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crisis-response.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 text-indigo-600 mr-2" />
              AI Response Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">Generate professional crisis communications</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crisis Type
              </label>
              <select
                value={selectedType.id}
                onChange={(e) => setSelectedType(crisisTypes.find(t => t.id === e.target.value) || crisisTypes[0])}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {crisisTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                {selectedType.description}
              </p>
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full h-10 flex items-center justify-center rounded-lg text-white font-medium transition-colors ${
                  isGenerating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Response...
                  </>
                ) : (
                  'Generate Response'
                )}
              </motion.button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Generated Response
              </label>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors relative"
                  title="Copy to clipboard"
                  disabled={!response}
                >
                  <AnimatePresence>
                    {copySuccess ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.span>
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                  title="Download as markdown"
                  disabled={!response}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <motion.div 
              className="relative min-h-[400px]"
              initial={false}
              animate={{ height: response ? 'auto' : '400px' }}
            >
              <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-indigo-50 prose max-w-none min-h-[400px]">
                {response ? (
                  <ReactMarkdown>{response}</ReactMarkdown>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-center">
                      Click "Generate Response" to create a crisis communication template
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}