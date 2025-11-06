--PART1
INSERT INTO account(account_firstname,account_lastname,account_email,account_password)
VALUES('Tony','Stark','tony@starkent.com','Iam1ronM@n');

--PART2
UPDATE account SET account_type='Admin' WHERE account_email = 'tony@starkent.com';

--PART3
DELETE FROM account WHERE account_id=1;

--PART4
UPDATE inventory 
SET inv_description ='Do you have 6 kids and like to go offroading? The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.'
WHERE inv_make = 'GM' OR inv_model = 'Hummer';

--PART5
SELECT inv_make,inv_model,classification_name
FROM inventory
INNER JOIN classification
ON inventory.classification_id=classification.classification_id
WHERE classification_name = 'Sport';


--PART6
UPDATE inventory
SET inv_image= REPLACE(inv_image,'/images/','/images/vehicles/'),
inv_thumbnail= REPLACE (inv_thumbnail,'/images/','/images/vehicles/');