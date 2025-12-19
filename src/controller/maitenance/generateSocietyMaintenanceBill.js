import PDFDocument from "pdfkit";
import maintenanceModel from "../../model/maintenance.js";
import adminModel from "../../model/admin.js";

const generateSocietyMaintenanceBill = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // ✅ DATE FORMAT FUNCTION
    const formatDate = (date) => {
      if (!date) return "-";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // ✅ 1️⃣ PEHLE PAYMENT LO
    const payment = await maintenanceModel.findById(paymentId);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    if (payment.status !== "Paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }

    // ✅ 2️⃣ FIR BUILDING / ADMIN LO
    const admin = await adminModel.findOne({
      buildingCode: payment.buildingCode,
    });

    const buildingName = admin?.bname || "Society Maintenance";

    // ✅ 3️⃣ PDF START
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=Maintenance-Bill-${payment.month}.pdf`
    );

    doc.pipe(res);

    /* ===================== HEADER ===================== */
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(buildingName.toUpperCase(), { align: "center" });

    doc.moveDown(0.3);

    doc
      .fontSize(14)
      .font("Helvetica")
      .text("Society Maintenance Bill Receipt", { align: "center" });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    /* ===================== MEMBER DETAILS ===================== */
    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica");

    doc.text(`Member Name        : ${payment.memberName}`);
    doc.text(`Flat / Shop No     : ${payment.No} (${payment.Type})`);
    doc.text(`Maintenance Month  : ${payment.month}`);
    doc.text(`Payment Mode       : ${payment.paymentMode}`);
    doc.text(`Payment Date       : ${formatDate(payment.paidDate)}`);

    /* ===================== AMOUNT ===================== */
    doc.moveDown(1);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Amount Paid :  ${payment.amount} /-`, { align: "right" });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    /* ===================== FOOTER ===================== */
    doc.moveDown(2);
    doc
      .fontSize(11)
      .font("Helvetica-Oblique")
      .text("This is a system generated receipt. No signature is required.", {
        align: "center",
      });

    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Thank you for your maintenance payment.", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Bill Error Message:", error.message);
    console.error("Bill Error Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: error.message || "Bill generation failed",
    });
  }
};

export default generateSocietyMaintenanceBill;
