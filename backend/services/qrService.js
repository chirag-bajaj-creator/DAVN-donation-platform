const QRCode = require('qrcode');

const qrService = {
  /**
   * Generate UPI QR code for payment
   */
  generateUPIQR: async (amount, merchantId, transactionId) => {
    try {
      // UPI deep link format
      // upi://pay?pa=<UPI_ID>&pn=<PAYEE_NAME>&am=<AMOUNT>&tn=<DESCRIPTION>&tr=<REFERENCE_ID>
      const upiLink = `upi://pay?pa=${merchantId}@upi&pn=HravinderDonations&am=${amount}&tn=Donation&tr=${transactionId}`;

      // Generate QR code as base64 image
      const qrCode = await QRCode.toDataURL(upiLink, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      console.log('✓ UPI QR code generated for transaction:', transactionId);

      return {
        qrCode,
        upiLink,
        transactionId
      };
    } catch (error) {
      console.error('✗ Failed to generate QR code:', error.message);
      throw new Error('Failed to generate QR code');
    }
  },

  /**
   * Generate dynamic QR code with logo (optional)
   */
  generateQRWithLogo: async (data, logoUrl = null) => {
    try {
      const qrCode = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2
      });

      return qrCode;
    } catch (error) {
      console.error('✗ Failed to generate QR code with logo:', error.message);
      throw new Error('Failed to generate QR code');
    }
  },

  /**
   * Validate UPI ID format
   */
  isValidUPIID: (upiId) => {
    const upiRegex = /^[a-zA-Z0-9.-]{3,}@[a-zA-Z]{3,}$/;
    return upiRegex.test(upiId);
  },

  /**
   * Extract data from QR code (for testing/verification)
   */
  decodeQRCode: async (qrImagePath) => {
    try {
      // This would require a QR code decoding library like jsQR or similar
      // For now, we just return a placeholder
      console.log('QR decode functionality requires additional library');
      return null;
    } catch (error) {
      console.error('✗ Failed to decode QR code:', error.message);
      throw new Error('Failed to decode QR code');
    }
  }
};

module.exports = qrService;
