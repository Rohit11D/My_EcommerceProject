const express = require("express");
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")
const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword,
     getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateRole, deleteUser}
 = require("../controllers/userController");

const router = express.Router();

// creating a route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);

router.route("/Me").get(isAuthenticatedUser,getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser,updatePassword);
router.route("/updateProfile").put(isAuthenticatedUser,updateProfile);
router.route("/admin/AllUsers").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);
router.route("/admin/singleUser/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);
router.route("/admin/updateRole/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateRole);
router.route("/admin/deleteUser/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);
module.exports = router;