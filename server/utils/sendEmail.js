
import nodemailer from "nodemailer";

// export const saveTracking = async (req, res) => {
//   const { orderId, trackingId, message, courier } = req.body;

//   try {
//     const order = await Order.findById(orderId).populate("userId");

//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     order.trackingId = trackingId;
//     order.courier = courier || order.courier || "India Post";
//     await order.save();

//     // Prefer userId.email, fallback to userEmail (for guest orders)
//     const email = (order.userId && order.userId.email) || order.userEmail;
//     const name = order.deliveryDetails.fullName;

//     // Send email from admin
//     if (!email) throw new Error("No user email found for this order");
//     await sendTrackingEmail(email, name, trackingId, message, order.courier);

//     res.json({ success: true, message: "Tracking ID saved and email sent." });
//   } catch (err) {
//     console.error("Tracking Error:", err);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// };

// Utility to send tracking email from admin to user
// --- Styled HTML Email ---
export async function sendTrackingEmail(email, name, trackingId, message, courierParam) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // dalipshekhawat2863@gmail.com
      pass: process.env.MAIL_PASS  // jqof mfqu bdfx lnig
    }
  });

  // Use courierParam if provided, else parse from message
  let courier = courierParam || "";
  let tracking = trackingId;
  if (!courier) {
    try {
      const msgObj = JSON.parse(message);
      courier = msgObj.courier || "";
      tracking = msgObj.trackingId || trackingId;
    } catch {
      // message is not JSON, ignore
    }
  }

  // Removed default courier fallback to "India Post" to show selected courier name only
  // if (!courier || courier.trim() === "") {
  //   courier = "India Post"; // default courier if none selected
  // }

  // Fix: Show courier name only if it exists, else show empty string to avoid "courier service " without name
  const courierDisplay = courier && courier.trim() !== "" ? courier : "";

  const emailMessage = `
  Hello ${name || 'Customer'},

  This is an update regarding your recent order at UKF. We’ve dispatched your order with courier service ${courierDisplay} and your tracking id is ${tracking}

  Tracking #${tracking}

  You will receive your order soon

  Regards,
  UKF
  `;

  const mailOptions = {
    from: `UKF <${process.env.MAIL_USER}>`,
    to: email,
    subject: `Dispatched! Your UKF order has been dispatched`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f7f7; padding: 32px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgba(44,110,49,0.08); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #2c6e31 60%, #4caf50 100%); padding: 24px 0; text-align: center;">
            <img src="https://i.ibb.co/6b7n6k2/aravali-logo.png" alt="UKF" style="height: 48px; margin-bottom: 8px;"/>
            <h2 style="color: #fff; margin: 0; font-size: 1.6rem; letter-spacing: 1px;">Order Update</h2>
          </div>
          <div style="padding: 28px 32px 24px 32px;">
            <p style="font-size: 1.1rem; color: #222; margin-bottom: 18px;">Dear <b>${name || 'Customer'}</b>,</p>
            <div style="background: #f1f8f2; border-left: 4px solid #2c6e31; padding: 16px 18px; border-radius: 6px; margin-bottom: 18px;">
              <span style="font-size: 1.05rem; color: #222;">${emailMessage.replace(/\n/g, '<br/>')}</span>
            </div>
            <p style="margin: 0 0 18px 0; color: #555; font-size: 0.98rem;">Thank you for shopping with us.<br/>- <b>UKF</b></p>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://ukf.com" style="display: inline-block; background: #2c6e31; color: #fff; text-decoration: none; padding: 10px 28px; border-radius: 5px; font-weight: 600; font-size: 1rem; letter-spacing: 0.5px;">Visit Our Website</a>
            </div>
          </div>
        </div>
        <div style="text-align: center; color: #aaa; font-size: 0.9rem; margin-top: 18px;">&copy; ${new Date().getFullYear()} UKF</div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}


export async function sendOrderConfirmationEmail(req, res) {
  const { email, fullName, orderId, items, shippingCharges, totalAmount, shippingInfo } = req.body;


  if (!email || !fullName || !orderId || !items || !totalAmount || !shippingInfo) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  const itemsRows = items.map(item => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 8px;">${item.title}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">₹${item.netPrice}</td>
    </tr>
  `).join("");

  const emailHtml = `
  <div style="font-family: 'Inter', sans-serif; background-color: #000; color: #FFD770; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2 style="color: #FFD770; text-align: center;">✨ Order Confirmed – UKF Outfits ✨</h2>
    <p>Hello <b>${fullName}</b>,</p>
    <p>We're thrilled you've chosen UKF-Outfits to elevate your fashion game. Your order has been confirmed and is now being prepared for dispatch.</p>

    <h3 style="color: #FFD770;">🧾 ORDER ID: #${orderId}</h3>

    <p>Here’s a breakdown of your purchase:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background-color: #FFD770; color: #000;">
          <th style="padding: 10px;">Item</th>
          <th style="padding: 10px;">Qty</th>
          <th style="padding: 10px;">Price</th>
        </tr>
      </thead>
      <tbody style="color: #FFD770;">
        ${itemsRows}
        <tr>
          <td style="padding: 8px;">Shipping Charges</td>
          <td style="padding: 8px;">–</td>
          <td style="padding: 8px;">₹${shippingCharges}</td>
        </tr>
        <tr style="font-weight: bold;">
          <td colspan="2" style="padding: 8px;">Total Amount</td>
          <td style="padding: 8px;">₹${totalAmount}</td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top: 20px;">📦 Shipping Info</h3>
    <p>Name: ${shippingInfo.fullName}</p>
    <p>Address: ${shippingInfo.address}</p>
    <p>Contact: ${shippingInfo.mobile}</p>

    <p style="margin-top: 20px;">You’ll receive a tracking ID once your package is out for delivery.</p>
    <p>Thank you for shopping with us! We can't wait for you to rock your new look 🔥</p>

    <p style="margin-top: 30px;">With style,<br><b>Team UKF-Outfits</b></p>
    <p><a href="https://ukfoutfits.com" style="color: #FFD770;">Visit Our Store</a></p>
  </div>
  `;

  const mailOptions = {
    from: `UKF-Outfits <${process.env.MAIL_USER}>`,
    to: email,
    subject: `🧾 Order Confirmed | UKF-Outfits #${orderId}`,
    html: emailHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Order confirmation email sent" });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}
