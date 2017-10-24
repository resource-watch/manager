import { getVisualisationTypes } from '../components/widget-builder/helpers/dataset-helpers';

require('isomorphic-fetch');
require('colors');
require('dotenv').load();

const URL = `${process.env.WRI_API_URL}/dataset?${[process.env.APPLICATIONS].join(',')}&page[size]=999&status=saved`;

fetch(URL)
  .then((response) => {
    if (response.status >= 400) throw new Error(response.statusText);
    return response.json();
  })
  .then((datasets) => {
    const { data } = datasets;
    for (let i = data.length - 1; i >= 0; i--) {
      const d = data[i];
      const parsedData = { id: d.id, ...d.attributes };

      try {
        const { visualisationTypes } = getVisualisationTypes(parsedData);
        if (!visualisationTypes || visualisationTypes.length === 0) {
          console.log(d.id, 'FAIL'.red, visualisationTypes);
        }
        // Showing only failed datasets
        // else {
        //   console.log(d.id, 'OK'.green, visualisationTypes);
        // }
      } catch(e) {
        console.log(d.id, 'FAIL'.red, e.message);
      }
    }
    console.log('Total', data.length);
  });;
