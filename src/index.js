/**
 * scope=read,profile:read_all,activity:read,activity:read_all
 * http://www.strava.com/oauth/authorize?client_id=63218&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read,profile:read_all,activity:read,activity:read_all
 *
 * https://www.strava.com/oauth/authorize
 * ?client_id=63218
 * &response_type=code
 * &redirect_uri=http://localhost:3000
 * &approval_prompt=force
 * &scope=read,profile:read_all,activity:read,activity:read_all
 *
 *
 * https://www.strava.com/oauth/token
 * ?client_id=63218
 * &client_secret=ac8f12b31be72160ce0248b6f16c7c385e19000a
 * &code=bbc8aaeb68c5c0dd78b1d8d85c5f9bff2b1d2a7e
 * &grant_type=authorization_code
 */

import { Strava } from 'strava';
import { format } from 'date-fns';
import * as d3 from 'd3-format';

const locale = d3.formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['R$', ''],
});

const strava = new Strava({
  client_id: '63218',
  client_secret: 'ac8f12b31be72160ce0248b6f16c7c385e19000a',
  refresh_token: '2461120518e959be944353d9d7bc9d0053bd18d6',
});

(async () => {
  try {
    let totalMovingTimeInSeconds = 0;
    let totalKms = 0;
    const bikeToAnalyse = 'Oggi 7.3';
    // const bikeToAnalyse = 'Pretinha';

    const athlete = await strava.athletes.getLoggedInAthlete();
    const activities = await strava.activities.getLoggedInAthleteActivities({
      per_page: 200,
    });

    console.log(
      `>> ${activities.length} atividades do atleta ${athlete.firstname} ${athlete.lastname}`
    );
    console.log('_____________________________________________________');

    const [bike] = athlete.bikes.filter((bike) => bike.name === bikeToAnalyse);

    console.log(`>> Análise da bike ${bikeToAnalyse}:`);
    activities.map((activity) => {
      if (activity.type === 'Ride' && activity.gear_id === bike.id) {
        console.log(
          `${format(new Date(activity.start_date), 'dd/MM/yyyy HH:mm:ss')} - ${
            activity.name
          } - ${locale.format(',.2f')(
            activity.distance / 1000
          )} km - ${secondsToHms(activity.moving_time)}`
        );
        totalMovingTimeInSeconds =
          totalMovingTimeInSeconds + activity.moving_time;

        totalKms = totalKms + activity.distance;
      }
    });
    console.log('_____________________________________________________');
    console.log(
      `Distância total: ${locale.format(',.2f')(
        totalKms / 1000
      )} km - Tempo total: ${secondsToHms(totalMovingTimeInSeconds)}`
    );
  } catch (error) {
    console.log(error);
  }
})();

function secondsToHms(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  const movingTime = `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return movingTime;
}
