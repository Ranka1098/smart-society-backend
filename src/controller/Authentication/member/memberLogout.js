const memberLogout = async (req, res) => {
  try {
    res.clearCookie("memberToken", {
      httpOnly: true,
      secure: false, // <---- localhost ke liye FALSE
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Member logout successful",
    });
  } catch (error) {
    console.error("Member Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default memberLogout;
