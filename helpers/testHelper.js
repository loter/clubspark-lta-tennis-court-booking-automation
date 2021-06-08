const delay = require('delay');
const chrome = require('selenium-webdriver/chrome');
const {
  Builder,
  By,
  until
} = require('selenium-webdriver');

const defaultWait = 4000;

function formatDate(date) {
  const d = new Date(date);
  console.log(`Date is ${d}`);
  d.setDate(d.getDate() + 6); // book for the 6th day in advance.

  let month = '' + (d.getMonth() + 1);
  let day = '' + (d.getDate());
  let year = d.getFullYear();

  if(month.length < 2)
    month = '0' + month;
  if(day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const bookCourt = async(courtId, startTime, durationInHours, ltaUsername, ltaPassword) => {
  const timeTillNextHour = (3600000 - new Date().getTime() % 3600000) + 1000; // add one more second.
  if(timeTillNextHour < 600000) {
    console.log(`timeTillNextHour: ${timeTillNextHour}`);
    await delay(timeTillNextHour); // need to execute right after midnight.
  } else {
    console.log("Sorry, boss, I've missed the time, will continue running booking without delay.");
  }

  const date = formatDate(new Date().toLocaleString("en-UK", { timeZone: "Europe/London" }));
  console.log(`Formatted date: ${date}`);
  const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().addArguments('--headless', '--disable-dev-shm-usage', '--no-sandbox', 'headless'))
  .build();

  const endTime = startTime + durationInHours; // 17.5 + 1.5 = 19.0
  const startTimeInMinutes = startTime * 60; // 1050 when startTime is 17.5, used to find the booking element.
  const endTimeInMinutes = endTime * 60; // 1140 when startTime is 17.5 and durationInHours is 1.5, used to find the booking element.

  // Sign-in
  await driver.get('https://auth.clubspark.uk/account/signin');
  await driver.wait(until.titleContains("ClubSpark"), defaultWait);
  const emailAddress = await driver.findElement(By.id('EmailAddress'));
  await emailAddress.sendKeys(ltaUsername);
  const password = await driver.findElement(By.id('Password'));
  await password.sendKeys(ltaPassword);
  const submit = await driver.findElement(By.id('signin-btn'));
  await submit.click();
  await driver.wait(until.titleContains('ClubSpark / Home'));
  await driver.get(`https://clubspark.lta.org.uk/ActonPark2/Booking/BookByDate#?date=${date}&role=guest`);

  // Accept cookie
  await driver.wait(until.elementLocated(By.xpath(`//a[@class='cb-enable']`)), defaultWait);
  const cookieNotice = await driver.findElement(By.xpath(`//a[@class='cb-enable']`));
  await driver.wait(until.elementIsVisible(cookieNotice), defaultWait);
  await driver.wait(until.elementIsEnabled(cookieNotice), defaultWait);
  await cookieNotice.click();

  // Book court
  await driver.wait(until.titleContains('Book by date'));
  await driver.wait(until.elementLocated(By.xpath(`//a[contains(@data-test-id, 'booking-${courtId}|${date}|${startTimeInMinutes}')]`)), defaultWait);
  const startDate = await driver.findElement(By.xpath(`//a[contains(@data-test-id, 'booking-${courtId}|${date}|${startTimeInMinutes}')]`));
  await driver.wait(until.elementIsVisible(startDate), defaultWait);
  await driver.wait(until.elementIsEnabled(startDate), defaultWait);
  await startDate.click();
  await driver.wait(until.elementLocated(By.id("submit-booking")), defaultWait);

  await driver.wait(until.elementLocated(By.xpath(`//span[contains(@aria-labelledby, 'select2-booking-duration-container')]`)), defaultWait);
  const durationDropDown = await driver.findElement(By.xpath(`//span[contains(@aria-labelledby, 'select2-booking-duration-container')]`));
  await driver.wait(until.elementIsVisible(durationDropDown), defaultWait);
  await driver.wait(until.elementIsEnabled(durationDropDown), defaultWait);
  await durationDropDown.click();

  await driver.wait(until.elementLocated(By.xpath(`//li[contains(@id,'-${endTimeInMinutes}')]`)), defaultWait);
  const endTimeDropDown = await driver.findElement(By.xpath(`//li[contains(@id,'-${endTimeInMinutes}')]`));
  await driver.wait(until.elementIsVisible(endTimeDropDown), defaultWait);
  await driver.wait(until.elementIsEnabled(endTimeDropDown), defaultWait);
  await endTimeDropDown.click();

  await driver.wait(until.elementLocated(By.id("submit-booking")), defaultWait);
  const bookButton = await driver.findElement(By.id("submit-booking"));
  await driver.wait(until.elementIsVisible(bookButton), defaultWait);
  await driver.wait(until.elementIsEnabled(bookButton), defaultWait);
  await bookButton.click();
  await driver.close();
  await driver.quit();
}

module.exports = {
  bookCourt,
}
