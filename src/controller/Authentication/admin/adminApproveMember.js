import PendingMember from "../../../model/pendingMember.js";
import Member from "../../../model/member.js";

const adminApproveMember = async (req, res) => {
  try {
    const { pendingId } = req.body;

    // 1️⃣ Find pending member
    const pending = await PendingMember.findById(pendingId);
    if (!pending)
      return res.status(404).json({ message: "Pending data not found" });

    // 2️⃣ OTP not verified
    if (!pending.isVerified)
      return res.status(400).json({ message: "Member has not verified OTP" });

    // 3️⃣ Already approved?
    const exists = await Member.findOne({ primaryPhone: pending.primaryPhone });
    if (exists)
      return res.status(400).json({ message: "Member already approved" });

    // ------------------------------------------
    // 4️⃣ APPROVAL LOGIC BASED ON MEMBER TYPE
    // ------------------------------------------
    // 🔹 Removed Vacant old member update logic

    // 🏠 FLAT OWNER
    if (pending.memberType === "Flat" && pending.status === "Owner") {
      await Member.create({
        memberType: "Flat",
        status: "Owner",
        buildingCode: pending.buildingCode,

        flatNo: pending.flatNo,
        flatOwnerName: pending.flatOwnerName,
        primaryPhone: pending.primaryPhone,

        memberInFamily: pending.memberInFamily,
        men: pending.men,
        women: pending.women,
        kids: pending.kids,

        password: pending.password,
        approvalStatus: "Approved",
        isMember: true,

        // 🔹 Removed residencyStatus & isActive
      });
    }

    // 🏠 FLAT RENT
    else if (pending.memberType === "Flat" && pending.status === "Rent") {
      await Member.create({
        memberType: "Flat",
        status: "Rent",
        buildingCode: pending.buildingCode,

        flatNo: pending.flatNo,
        flatOwnerName: pending.flatOwnerName,
        flatOwnerPhoneNumber: pending.flatOwnerPhoneNumber,
        flatRenterName: pending.flatRenterName,
        primaryPhone: pending.primaryPhone,
        dateOfJoiningFlat: pending.dateOfJoiningFlat,

        memberInFamily: pending.memberInFamily,
        men: pending.men,
        women: pending.women,
        kids: pending.kids,

        password: pending.password,
        approvalStatus: "Approved",
        isMember: true,
      });
    }

    // 🏪 SHOP OWNER
    else if (pending.memberType === "Shop" && pending.status === "Owner") {
      await Member.create({
        memberType: "Shop",
        status: "Owner",
        buildingCode: pending.buildingCode,

        shopNo: pending.shopNo,
        shopOwnerName: pending.shopOwnerName,
        primaryPhone: pending.primaryPhone,

        password: pending.password,
        approvalStatus: "Approved",
        isMember: true,
      });
    }

    // 🏪 SHOP RENT
    else if (pending.memberType === "Shop" && pending.status === "Rent") {
      await Member.create({
        memberType: "Shop",
        status: "Rent",
        buildingCode: pending.buildingCode,

        shopNo: pending.shopNo,
        shopOwnerName: pending.shopOwnerName,
        shopOwnerPhoneNumber: pending.shopOwnerPhoneNumber,
        shopRenterName: pending.shopRenterName,
        primaryPhone: pending.primaryPhone,
        dateOfJoiningShop: pending.dateOfJoiningShop,

        password: pending.password,
        approvalStatus: "Approved",
        isMember: true,
      });
    }

    // 5️⃣ Remove pending record after approval
    await PendingMember.findByIdAndDelete(pendingId);

    // 6️⃣ TEMPORARY CONSOLE NOTIFICATION (SMS-style)
    console.log(
      `📢 Member Notification: Dear ${
        pending.flatOwnerName ||
        pending.flatRenterName ||
        pending.shopOwnerName ||
        "Member"
      }, your membership request for ${
        pending.flatNo
          ? `Flat ${pending.flatNo}`
          : pending.shopNo
          ? `Shop ${pending.shopNo}`
          : "your unit"
      } in building ${
        pending.buildingCode
      } has been APPROVED. You can now login.`
    );

    return res.status(200).json({
      success: true,
      message: "Member approved successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default adminApproveMember;
