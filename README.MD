E-Commerce API Overview

UPLOADED WITH RENDER FREE SERVICE PLAN SO HOST NEEDS TIME LOADING

## This E-Commerce API provides a comprehensive set of features for managing user authentication, product listings, order processing, and customer reviews. It enables developers to build robust e-commerce applications with the following functionalities:

AUTHENTICATION

Register: Allows new users to create an account by validating their email and storing their information securely. Generates authentication cookies for session management.
Login: Authenticates users by checking their credentials and establishing a session through authentication cookies.
Logout: Ends the user session by clearing authentication cookies and confirming the logout.

---

USER MANAGEMENT

Get All Users: Fetches all users with the role of "user," excluding sensitive information like passwords.
Get Single User: Retrieves details of a specific user by ID, ensuring proper permissions.
Show Current User: Displays information of the currently logged-in user.
Update User: Modifies user information (name and email) after validating the current password.
Update User Password: Allows users to change their password after verifying their current one.

---

PRODUCT MANAGEMENT

Create Product: Facilitates adding new products with details provided by the user.
Get All Products: Returns a list of all products along with the total count.
Get Single Product: Fetches details of a specific product, including associated reviews.
Update Product: Enables updates to existing product details.
Delete Product: Removes a specific product from the database.
Upload Image: Manages image uploads to Cloudinary and returns the image URL.

---

ORDER MANAGEMENT

Create Order: Validates cart items, calculates totals, and processes the order creation.
Get All Orders: Retrieves a comprehensive list of all orders with counts.
Get Single Order: Fetches details of a specific order for the current user.
Get Current User Orders: Lists all orders placed by the currently logged-in user.
Update Order: Allows modifications to the order status.

---

REVIEW MANAGEMENT

Create Review: Validates product and user submissions before creating a new review.
Get All Reviews: Collects all reviews, including product and user details.
Get Single Review: Retrieves a specific review by ID with associated details.
Update Review: Allows changes to existing reviews based on user input.
Delete Review: Removes a specific review from the database.
Get Single Product Reviews: Gathers all reviews for a specific product, along with a review count.
