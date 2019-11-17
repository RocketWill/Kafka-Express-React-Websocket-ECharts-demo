[
    {
      '$match': {
        'timestamp': {
          '$gte': '2019-11-05', 
          '$lte': '2019-11-07'
        }
      }
    }, {
      '$project': {
        'day': {
          '$substr': [
            '$timestamp', 0, 10
          ]
        }, 
        'packets': 1, 
        'bytes': 1
      }
    }, {
      '$group': {
        '_id': '$day', 
        'bytes': {
          '$sum': '$bytes'
        }, 
        'packets': {
          '$sum': '$packets'
        }
      }
    }
  ]