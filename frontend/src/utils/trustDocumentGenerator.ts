import { TrustData } from '../backend';

export async function generateTrustDocument(trustData: TrustData, isSample: boolean = false): Promise<void> {
  try {
    // Create the Word document content as XML
    const documentXml = createTrustDocumentXml(trustData, isSample);
    const stylesXml = createStylesXml();
    const relsXml = createRelsXml();
    const contentTypesXml = createContentTypesXml();
    const appXml = createAppXml();
    const coreXml = createCoreXml(trustData, isSample);

    // Create the ZIP file structure for .docx using a more robust approach
    const zipBlob = await createDocxZip({
      'word/document.xml': documentXml,
      'word/styles.xml': stylesXml,
      'word/_rels/document.xml.rels': relsXml,
      '[Content_Types].xml': contentTypesXml,
      'docProps/app.xml': appXml,
      'docProps/core.xml': coreXml,
      '_rels/.rels': createMainRelsXml()
    });
    
    // Verify the blob is valid
    if (!zipBlob || zipBlob.size === 0) {
      throw new Error('Generated document is empty or invalid');
    }

    // Create download link with proper filename
    const prefix = isSample ? 'SAMPLE_' : '';
    const fileName = `${prefix}${sanitizeFileName(trustData.trustName)}_Revocable_Living_Trust.docx`;
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Error generating trust document:', error);
    throw new Error(`Failed to generate trust document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Improved ZIP creation function that creates standard, unprotected .docx files
async function createDocxZip(files: Record<string, string>): Promise<Blob> {
  const encoder = new TextEncoder();
  const zipEntries: ZipEntry[] = [];
  let centralDirSize = 0;
  let centralDirOffset = 0;

  // Create local file entries
  for (const [path, content] of Object.entries(files)) {
    const contentBytes = encoder.encode(content);
    const pathBytes = encoder.encode(path);
    
    const localHeader = createLocalFileHeader(pathBytes, contentBytes);
    const centralDirEntry = createCentralDirEntry(pathBytes, contentBytes, centralDirOffset);
    
    zipEntries.push({
      localHeader,
      content: contentBytes,
      centralDirEntry,
      path
    });
    
    centralDirOffset += localHeader.length + contentBytes.length;
    centralDirSize += centralDirEntry.length;
  }

  // Create end of central directory record
  const endOfCentralDir = createEndOfCentralDir(zipEntries.length, centralDirSize, centralDirOffset);

  // Combine all parts
  const totalSize = zipEntries.reduce((size, entry) => 
    size + entry.localHeader.length + entry.content.length, 0) + 
    centralDirSize + endOfCentralDir.length;

  const zipData = new Uint8Array(totalSize);
  let offset = 0;

  // Write local file headers and content
  for (const entry of zipEntries) {
    zipData.set(entry.localHeader, offset);
    offset += entry.localHeader.length;
    zipData.set(entry.content, offset);
    offset += entry.content.length;
  }

  // Write central directory entries
  for (const entry of zipEntries) {
    zipData.set(entry.centralDirEntry, offset);
    offset += entry.centralDirEntry.length;
  }

  // Write end of central directory
  zipData.set(endOfCentralDir, offset);

  // Create blob with proper MIME type for Word documents
  return new Blob([zipData], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
}

interface ZipEntry {
  localHeader: Uint8Array;
  content: Uint8Array;
  centralDirEntry: Uint8Array;
  path: string;
}

function createLocalFileHeader(pathBytes: Uint8Array, contentBytes: Uint8Array): Uint8Array {
  const header = new Uint8Array(30 + pathBytes.length);
  const view = new DataView(header.buffer);
  
  // Local file header signature
  view.setUint32(0, 0x04034b50, true);
  // Version needed to extract (2.0)
  view.setUint16(4, 20, true);
  // General purpose bit flag (no encryption, no compression)
  view.setUint16(6, 0, true);
  // Compression method (0 = stored/no compression)
  view.setUint16(8, 0, true);
  // File last modification time (default)
  view.setUint16(10, 0, true);
  // File last modification date (default)
  view.setUint16(12, 0, true);
  // CRC-32 of uncompressed data
  view.setUint32(14, calculateCRC32(contentBytes), true);
  // Compressed size (same as uncompressed since no compression)
  view.setUint32(18, contentBytes.length, true);
  // Uncompressed size
  view.setUint32(22, contentBytes.length, true);
  // File name length
  view.setUint16(26, pathBytes.length, true);
  // Extra field length
  view.setUint16(28, 0, true);
  
  // Add filename
  header.set(pathBytes, 30);
  
  return header;
}

function createCentralDirEntry(pathBytes: Uint8Array, contentBytes: Uint8Array, localHeaderOffset: number): Uint8Array {
  const entry = new Uint8Array(46 + pathBytes.length);
  const view = new DataView(entry.buffer);
  
  // Central directory file header signature
  view.setUint32(0, 0x02014b50, true);
  // Version made by (2.0)
  view.setUint16(4, 20, true);
  // Version needed to extract (2.0)
  view.setUint16(6, 20, true);
  // General purpose bit flag (no encryption, no compression)
  view.setUint16(8, 0, true);
  // Compression method (0 = stored)
  view.setUint16(10, 0, true);
  // File last modification time
  view.setUint16(12, 0, true);
  // File last modification date
  view.setUint16(14, 0, true);
  // CRC-32
  view.setUint32(16, calculateCRC32(contentBytes), true);
  // Compressed size
  view.setUint32(20, contentBytes.length, true);
  // Uncompressed size
  view.setUint32(24, contentBytes.length, true);
  // File name length
  view.setUint16(28, pathBytes.length, true);
  // Extra field length
  view.setUint16(30, 0, true);
  // File comment length
  view.setUint16(32, 0, true);
  // Disk number start
  view.setUint16(34, 0, true);
  // Internal file attributes
  view.setUint16(36, 0, true);
  // External file attributes
  view.setUint32(38, 0, true);
  // Relative offset of local header
  view.setUint32(42, localHeaderOffset, true);
  
  // Add filename
  entry.set(pathBytes, 46);
  
  return entry;
}

function createEndOfCentralDir(numEntries: number, centralDirSize: number, centralDirOffset: number): Uint8Array {
  const endRecord = new Uint8Array(22);
  const view = new DataView(endRecord.buffer);
  
  // End of central directory signature
  view.setUint32(0, 0x06054b50, true);
  // Number of this disk
  view.setUint16(4, 0, true);
  // Number of the disk with the start of the central directory
  view.setUint16(6, 0, true);
  // Total number of entries in the central directory on this disk
  view.setUint16(8, numEntries, true);
  // Total number of entries in the central directory
  view.setUint16(10, numEntries, true);
  // Size of the central directory
  view.setUint32(12, centralDirSize, true);
  // Offset of start of central directory
  view.setUint32(16, centralDirOffset, true);
  // ZIP file comment length
  view.setUint16(20, 0, true);
  
  return endRecord;
}

function calculateCRC32(data: Uint8Array): number {
  // CRC32 lookup table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    crcTable[i] = crc;
  }
  
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createTrustDocumentXml(trustData: TrustData, isSample: boolean = false): string {
  const currentYear = new Date().getFullYear();
  const watermark = isSample ? `
    <!-- Draft Watermark -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="400"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
          <w:color w:val="CCCCCC"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>DRAFT - SAMPLE FOR REFERENCE</w:t>
      </w:r>
    </w:p>
  ` : '';
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${watermark}
    
    <!-- Title -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="400"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="28"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>REVOCABLE LIVING TRUST AGREEMENT</w:t>
      </w:r>
    </w:p>

    <!-- Trust Name -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="600"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>${escapeXml(trustData.trustName.toUpperCase())}</w:t>
      </w:r>
    </w:p>

    <!-- Article I - Creation of Trust -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE I - CREATION OF TRUST</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>I, ${escapeXml(trustData.trustorName)}, a resident of the State of California, hereby create this revocable living trust agreement, to be known as "${escapeXml(trustData.trustName)}" (the "Trust"). This Trust Agreement shall be governed by the laws of the State of California.</w:t>
      </w:r>
    </w:p>

    <!-- Article II - Trustee -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE II - APPOINTMENT OF TRUSTEE</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>I hereby appoint ${escapeXml(trustData.trusteeName)} as the initial Trustee of this Trust. Upon my death, incapacity, or resignation, I appoint ${escapeXml(trustData.successorTrusteeName)} as the successor Trustee. The Trustee shall have all powers necessary for the proper administration of this Trust as provided by California law and this Trust Agreement.</w:t>
      </w:r>
    </w:p>

    <!-- Article III - Trust Property -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE III - TRUST PROPERTY</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>The Trust shall consist of the following property and any additional property that may be added to the Trust:</w:t>
      </w:r>
    </w:p>

    ${trustData.trustAssets.map((asset: [string, string], index: number) => `
    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>${index + 1}. ${escapeXml(asset[0])}: ${escapeXml(asset[1])}</w:t>
      </w:r>
    </w:p>
    `).join('')}

    <!-- Article IV - Distribution During Trustor's Lifetime -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE IV - DISTRIBUTIONS DURING TRUSTOR'S LIFETIME</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>During my lifetime, while I am competent, the Trustee shall distribute to me or for my benefit such amounts of the net income and principal of the Trust as I may request from time to time. If I become incapacitated, the Trustee may distribute such amounts of income and principal as the Trustee deems necessary for my health, education, maintenance, and support.</w:t>
      </w:r>
    </w:p>

    <!-- Article V - Distribution After Death -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE V - DISTRIBUTION AFTER TRUSTOR'S DEATH</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>Upon my death, the Trustee shall distribute the Trust property to the following beneficiaries:</w:t>
      </w:r>
    </w:p>

    ${trustData.beneficiaries.map((beneficiary: [string, bigint], index: number) => `
    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>${index + 1}. ${Number(beneficiary[1])}% to ${escapeXml(beneficiary[0])}, if he/she survives me.</w:t>
      </w:r>
    </w:p>
    `).join('')}

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>Distribution Terms: ${escapeXml(trustData.distributionTerms)}</w:t>
      </w:r>
    </w:p>

    <!-- Article VI - Powers of Trustee -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE VI - POWERS OF TRUSTEE</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>The Trustee shall have all powers granted by California law, including but not limited to the power to: (a) buy, sell, exchange, lease, and manage real and personal property; (b) invest and reinvest Trust assets; (c) borrow money and mortgage Trust property; (d) make distributions to beneficiaries; (e) employ agents, attorneys, and other professionals; and (f) do all other acts necessary for the proper administration of the Trust.</w:t>
      </w:r>
    </w:p>

    <!-- Article VII - Revocation and Amendment -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE VII - REVOCATION AND AMENDMENT</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>During my lifetime, while I am competent, I reserve the right to revoke or amend this Trust Agreement in whole or in part by written instrument delivered to the Trustee. Upon my death or incapacity, this Trust shall become irrevocable and may not be amended or revoked.</w:t>
      </w:r>
    </w:p>

    <!-- Article VIII - General Provisions -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>ARTICLE VIII - GENERAL PROVISIONS</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>A. This Trust Agreement shall be governed by California law.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>B. If any provision of this Trust Agreement is held invalid, such invalidity shall not affect other provisions that can be given effect without the invalid provision.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>C. The Trustee shall not be required to post bond or other security.</w:t>
      </w:r>
    </w:p>

    ${isSample ? `
    <!-- Sample Notice -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="600" w:after="400"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="20"/>
          <w:color w:val="FF0000"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>THIS IS A SAMPLE DOCUMENT FOR REFERENCE PURPOSES ONLY</w:t>
      </w:r>
    </w:p>
    ` : ''}

    <!-- Signature Section -->
    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:before="600" w:after="400"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>IN WITNESS WHEREOF, I have executed this Trust Agreement on this _____ day of __________, ${currentYear}.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>____________________________________</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="400"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>${escapeXml(trustData.trustorName)}, Trustor</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>____________________________________</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="600"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>${escapeXml(trustData.trusteeName)}, Initial Trustee</w:t>
      </w:r>
    </w:p>

    <!-- Notarization -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="400" w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:u w:val="single"/>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>NOTARIZATION</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>State of California</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>County of _______________</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>On this _____ day of __________, ${currentYear}, before me personally appeared ${escapeXml(trustData.trustorName)}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="200"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>WITNESS my hand and official seal.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>____________________________________</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        </w:rPr>
        <w:t>Notary Public</w:t>
      </w:r>
    </w:p>

    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function createStylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        <w:sz w:val="24"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="360" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`;
}

function createRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
}

function createContentTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`;
}

function createAppXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Will Wisher Legal Will and Trust Creation App</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>1.0</AppVersion>
</Properties>`;
}

function createCoreXml(trustData: TrustData, isSample: boolean = false): string {
  const now = new Date().toISOString();
  const title = isSample ? `SAMPLE - Revocable Living Trust Agreement - ${trustData.trustName}` : `Revocable Living Trust Agreement - ${trustData.trustName}`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>Will Wisher Legal Will and Trust Creation App</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function createMainRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .trim();
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
