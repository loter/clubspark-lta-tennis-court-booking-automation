const { bookCourt } = require("../helpers/testHelper");

describe('book courts', () => {
  const courtIds = {
    court1Id: 'c2acbb00-af02-460d-b6db-444c2f617a80',
    court2Id: '5fed3659-9c46-44c8-bd9d-1d0061e522d6'
  }

  it('must book court 1', async() => {
    const startTime = 17.5; // 17.5 is 17:30
    const durationInHours = 1.5; // Currently supported values 0.5 for 30 minutes, 1.0 for one hour, 1.5 for 1:30 hours
    const ltaUsername = process.env.LTA_USERNAME;
    const ltaPassword = process.env.LTA_PASSWORD;

    await bookCourt(courtIds.court1Id, startTime, durationInHours, ltaUsername, ltaPassword);
  });

  it('must book court 2', async() => {
    const startTime = 17.5; // 17.5 is 17:30
    const durationInHours = 1.5; // Currently supported values 0.5 for 30 minutes, 1.0 for one hour, 1.5 for 1:30 hours
    const ltaUsername = process.env.LTA_USERNAME;
    const ltaPassword = process.env.LTA_PASSWORD;

    await bookCourt(courtIds.court2Id, startTime, durationInHours, ltaUsername, ltaPassword);
  });
});
