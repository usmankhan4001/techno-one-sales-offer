/**
 * Bitrix24 JS SDK Helper Utility
 * Integrates with Bitrix24 CRM Lead Card placements and REST API
 */

// Check if running inside Bitrix24 Iframe context
export const isBitrixEnvironment = () => {
  return typeof window !== 'undefined' && typeof window.BX24 !== 'undefined';
};

// Generic wrapper for BX24.callMethod using Promises
export const callBX24Method = (method, params = {}) => {
  return new Promise((resolve, reject) => {
    if (!isBitrixEnvironment()) {
      return reject(new Error('Bitrix24 SDK (BX24) is not loaded or available.'));
    }
    window.BX24.callMethod(method, params, (result) => {
      if (result.error()) {
        reject(result.error());
      } else {
        resolve(result.data());
      }
    });
  });
};

// Initialize Bitrix24 Placement & Fetch Current Lead Information
export const initBitrixPlacement = async () => {
  if (!isBitrixEnvironment()) {
    return { isBitrix: false, leadId: null, clientName: null };
  }

  return new Promise((resolve) => {
    window.BX24.init(async () => {
      try {
        // Auto-bind placement to Lead Detail Tab if not already registered
        try {
          const currentUrl = window.location.origin + window.location.pathname;
          await callBX24Method('placement.bind', {
            PLACEMENT: 'CRM_LEAD_DETAIL_TAB',
            HANDLER: currentUrl,
            TITLE: 'Techno One Sales Offer'
          });
          console.log('[Bitrix24] Bound CRM_LEAD_DETAIL_TAB placement successfully.');
        } catch (bindErr) {
          console.log('[Bitrix24] Placement bind note:', bindErr);
        }

        const placementInfo = window.BX24.placement.info();
        console.log('[Bitrix24] Placement Info:', placementInfo);

        const leadId = placementInfo?.options?.ID || placementInfo?.options?.LEAD_ID || null;

        if (leadId) {
          // Fetch Lead details from CRM
          const leadData = await callBX24Method('crm.lead.get', { id: leadId });
          console.log('[Bitrix24] Fetched Lead Data:', leadData);

          const firstName = leadData?.NAME || '';
          const lastName = leadData?.LAST_NAME || '';
          const fullClientName = `${firstName} ${lastName}`.trim() || leadData?.TITLE || 'Valued Client';

          resolve({
            isBitrix: true,
            leadId,
            clientName: fullClientName,
            leadData
          });
        } else {
          resolve({ isBitrix: true, leadId: null, clientName: null });
        }
      } catch (err) {
        console.error('[Bitrix24] Initialization error:', err);
        resolve({ isBitrix: true, leadId: null, clientName: null });
      }
    });
  });
};

// Helper: Convert Blob to Base64 String
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

/**
 * Attaches the generated PDF proposal to the Bitrix24 Lead Card
 * - Uploads to CRM custom file field ufCrm_1758688640
 * - Posts a comment to the Lead Timeline with the file attached
 */
export const attachProposalToLeadCard = async ({ leadId, pdfBlob, filename, unitNo, clientName }) => {
  if (!isBitrixEnvironment()) {
    throw new Error('Bitrix24 environment not detected.');
  }
  if (!leadId) {
    throw new Error('No target Lead ID specified.');
  }

  const FILE_FIELD = 'ufCrm_1758688640'; // Bitrix24 Lead File Field
  const ENTITY_TYPE_ID = 1; // 1 = Lead in Bitrix24 SPA/CRM

  console.log(`[Bitrix24] Attaching proposal for Lead ID ${leadId}...`);

  const base64Content = await blobToBase64(pdfBlob);
  const pdfFileName = filename || `Techno_One_Sales_Offer_${unitNo}.pdf`;

  // 1. Post to Lead Timeline as a comment attachment
  try {
    await callBX24Method('crm.timeline.comment.add', {
      fields: {
        ENTITY_ID: parseInt(leadId),
        ENTITY_TYPE: 'lead',
        COMMENT: `📄 Techno One Sales Offer generated for ${clientName} (Unit ${unitNo}).`,
        FILES: [
          [pdfFileName, base64Content]
        ]
      }
    });
    console.log('[Bitrix24] Timeline comment posted successfully.');
  } catch (err) {
    console.warn('[Bitrix24] Timeline comment note:', err);
  }

  // 2. Upload to CRM Item File Field (ufCrm_1758688640)
  try {
    const existingData = await callBX24Method('crm.item.get', {
      entityTypeId: ENTITY_TYPE_ID,
      id: leadId,
      select: [FILE_FIELD]
    });

    const item = existingData?.item || {};
    const existingFiles = Array.isArray(item[FILE_FIELD])
      ? item[FILE_FIELD].map((f) => ({ id: f.id }))
      : [];

    const newFilePayload = [pdfFileName, base64Content];
    const finalPayload = [...existingFiles, newFilePayload];

    await callBX24Method('crm.item.update', {
      entityTypeId: ENTITY_TYPE_ID,
      id: leadId,
      fields: {
        [FILE_FIELD]: finalPayload
      }
    });
    console.log('[Bitrix24] CRM Lead File Field updated successfully.');
  } catch (err) {
    console.warn('[Bitrix24] File field update note:', err);
  }

  return true;
};
