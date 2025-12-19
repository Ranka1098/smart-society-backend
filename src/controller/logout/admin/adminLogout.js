const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: false, // <---- localhost ke liye FALSE
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Admin logout successful",
    });
  } catch (error) {
    console.error("Admin Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminLogout;
