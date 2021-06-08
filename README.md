# LTA Tennis Court Booking

## Need help?

Please get in touch with me: dragomir.enachi.uk@gmail.com


## Did it save your time?

If so, please donate: http://paypal.me/dragomirenachi

## Why and how?

Tennis courts can booked 6 days in advance, the booking slot opens at midnight. Acton Park provides free courts that gets booked quickly.

Previously I had to set an alarm 23:58 to wake me up, so I have 2 minutes to login and book the court.

As I'm an automation expert, I've decided to automate booking process and never miss it (my favourite time 17:30).

The test script is using selenium, jest chromedriver and delay.

Jenkins will trigger the build each day at 23:53, Jenkins will perform setup, and the script will wait(using delay) till next hour starts (00:00:01) to continue booking.

The script will try to book court nr. 1, and if that fails (someone else booked it) - will try to book court 2 in Acton Park.
It will use username and password to login to [https://auth.clubspark.uk/account/signin](https://auth.clubspark.uk/account/signin)

Jenkins build trigger set to:

TZ=Europe/London

53 23 * * 0,1,2,3,4,5,6,7

To reuse the script you would need to provide:

- Environment variable to login to Club Spark website LTA_USERNAME and LTA_PASSWORD
- Booking location needs to be changed from https://clubspark.lta.org.uk/ActonPark2/ to your location
- Court ids need to be adjusted in the book.test.js file to match your booking location
