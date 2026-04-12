
6. System Overview
🔐 Login System
The system starts with a login interface where users must authenticate themselves.
Roles:
•	User
•	Admin
After successful login:
•	Users are redirected to the main dashboard
•	Admin has separate control (to be explained in next module)
________________________________________
7. User Dashboard Structure
After login, the user is directed to the main page containing three sections:
User Dashboard
│
├── Donation
├── Needy
└── Volunteer
 In this module, we focus on the Donation Section
________________________________________
8. Donation Section Structure
Donation
│
├── Individual
└── Organisation
Both categories provide the same donation options.
________________________________________
9. Donation Categories & Workflow
1. 💰 Cash Donation
 
 
 

Description:
Allows users to donate money digitally.
Workflow:
1.	User selects Cash
2.	Enters details:
o	Name
o	Phone Number
3.	System generates a QR Code
4.	User scans and completes payment
Key Feature:
•	Secure and quick digital payment system
________________________________________
2. 🍱 Food Donation
 
 
 


Description:
Users can donate cooked or packaged food.
Workflow:
1.	User enters:
o	Name
o	Phone Number
o	Address
2.	Specifies:
o	Type of food
o	Quantity
3.	Submits request
4.	System forwards data to volunteer/delivery agent
Key Feature:
•	Real-time coordination for food distribution
________________________________________
3. 🏠 Shelter Donation
 
Description:
Users can offer temporary or permanent shelter.
Workflow:
1.	User enters personal details
2.	Specifies:
o	Type of shelter (room, house, temporary stay)
3.	Submits request
Key Feature:
•	Helps homeless or displaced individuals
________________________________________
4. 💊 Medical Support


 
 
 

Description:
Users can donate medicines or medical assistance.
Workflow:
1.	User fills details
2.	Provides:
o	Type of medicine/support
o	Doctor permission (if required)
3.	Submits request
Key Feature:
•	Ensures safe and verified medical help
________________________________________
5. 📦 Basic Needs Donation
 
 



Description:
Users can donate essential items like:
•	Clothes
•	Blankets
•	Daily-use items
Workflow:
1.	User enters details
2.	Specifies items
3.	Submits donation
Key Feature:
•	Supports everyday survival needs
________________________________________
10. Data Flow (Simplified)
User Input → Form Submission → Database Storage → Volunteer Notification → Delivery to Needy
________________________________________
11. Key Features of Module
•	Role-based login system
•	Structured dashboard
•	Multi-category donation support
•	QR-based payment system
•	Real-time volunteer coordination
