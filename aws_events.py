import os
import requests
from dotenv import load_dotenv
import json
from datetime import datetime
import time
import psycopg2

load_dotenv()

def get_events(limit=100, offset=0, active=True):
    host = "https://gamma-api.polymarket.com/events"
    params = {
        "limit": limit,
        "offset": offset,
        "active": active,
        "closed": False,
        "order": "volume24hr",
        "ascending": False
    }
    response = requests.get(host, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")

def main():
    try:
        # Database connection parameters
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        cur = conn.cursor()
        
        print("Connected to the database.")

        while True:
            start_time = time.time()
            countEvent = 0
            limit = 100
            offset = 0
            all_events = []

            while True:
                events = get_events(limit=limit, offset=offset)
                if not events or len(events) < limit:
                    break
                all_events.extend(events)
                offset += limit

            # Insert data into table
            insert_event_query = """
                INSERT INTO events (
                    count, title, event_id, featured, volume, volume24hr, liquidity, creation_date,
                    start_date, end_date, markets, timestamp
                ) VALUES (
                    %(Count)s, %(Title)s, %(ID)s, %(Featured)s, %(Volume)s, %(Volume24hr)s, %(Liquidity)s,
                    %(CreationDate)s, %(StartDate)s, %(EndDate)s, %(Markets)s, %(Timestamp)s
                )
            """
            
            for event in all_events:
                countEvent += 1
                event_markets = event.get('markets', [])
                market_list = []
                for market in event_markets:
                    clob_rewards = market.get("clobRewards", [{}])[0]
                    market_data = {
                        "Featured": market.get('featured', False),
                        "Question": market.get('question', ""),
                        "Slug": market.get('slug', ""),
                        "ConditionID": market.get('conditionId', ""),
                        "ID": market.get('id', ""),
                        "CreatedDate": market.get('createdAt', None),
                        "StartDate": market.get('startDate', None),
                        "EndDate": market.get('endDate', None),
                        "Outcomes": market.get('outcomes', []),
                        "CLOBTokenIDs": market.get('clobTokenIds', []),
                        "OutcomePrices": market.get('outcomePrices', []),
                        "Liquidity": market.get('liquidity', 0),
                        "Volume": market.get('volume', 0),
                        "Volume24hr": market.get('volume24hr', 0),
                        "rewardsMinSize": market.get("rewardsMinSize", 0),
                        "rewardsMaxSpread": market.get("rewardsMaxSpread", 0),
                        "spread": market.get("spread", 0),
                        "rewardsDailyRate": clob_rewards.get("rewardsDailyRate", 0),
                        "rewardsStartDate": clob_rewards.get("startDate", None),
                        "rewardsEndDate": clob_rewards.get("endDate", None),
                        "Timestamp": datetime.now().isoformat()
                    }
                    market_list.append(market_data)

                event_data = {
                    "Count": countEvent,
                    "Title": event.get('title', ""),
                    "ID": event.get('id', ""),
                    "Featured": event.get('featured', False),
                    "Volume": event.get('volume', 0),
                    "Volume24hr": event.get('volume24hr', 0),
                    "Liquidity": event.get('liquidity', 0),
                    "CreationDate": event.get('creationDate', None),
                    "StartDate": event.get('startDate', None),
                    "EndDate": event.get('endDate', None),
                    "Markets": json.dumps(market_list),
                    "Timestamp": datetime.now().isoformat()
                }
                cur.execute(insert_event_query, event_data)
                

            conn.commit()
            print("All data inserted successfully.")
            total_time = time.time() - start_time
            print(f"Total elapsed time: {total_time:.2f} seconds")
            
            # Sleep for a specified duration before starting the next cycle
            sleep_duration = 3600  # sleep for 1 hour
            time.sleep(sleep_duration)

    except Exception as e:
        print("Error:", e)
    finally:
        if conn:
            cur.close()
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    main()
