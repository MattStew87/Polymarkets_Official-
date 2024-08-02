import os
import requests
from dotenv import load_dotenv
import json
from datetime import datetime
import time
import psycopg2

load_dotenv()

def get_markets(limit=100, offset=0):
    host = "https://gamma-api.polymarket.com/markets"
    params = {
        "limit": limit,
        "offset": offset,
        "active": True,
        "closed": False,
        "order": "volume24hr", 
        "ascending": False
    }
    response = requests.get(host, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Error: {}, {}".format(response.status_code, response.text))

def main():
    while True:
        conn = None
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
            
            print("---------------------------------")
            print("Connected to the database.")

            start_time = time.time()  
            count = 0
            limit = 100
            offset = 0
            all_markets = []

            while True:
                markets = get_markets(limit=limit, offset=offset)
                if not markets or len(markets) < limit:
                    break
                all_markets.extend(markets)
                offset += limit

            # Insert data into table
            insert_query = """
                INSERT INTO markets (
                    featured, question, slug, condition_id, market_id, created_at,
                    start_date, end_date, outcomes, clob_token_ids, outcome_prices,
                    liquidity, volume, volume24hr, rewards_min_size, rewards_max_spread, spread, 
                    rewards_daily_rate, rewards_start_date, rewards_end_date, count, timestamp
                ) VALUES (
                    %(featured)s, %(question)s, %(slug)s, %(conditionId)s, %(id)s, %(createdAt)s,
                    %(startDate)s, %(endDate)s, %(outcomes)s, %(clobTokenIds)s, %(outcomePrices)s,
                    %(liquidity)s, %(volume)s, %(volume24hr)s, %(rewardsMinSize)s, %(rewardsMaxSpread)s, %(spread)s, 
                    %(rewardsDailyRate)s, %(rewardsStartDate)s, %(rewardsEndDate)s, %(Count)s, %(timestamp)s
                )
            """
            
            for market in all_markets:
                count += 1
                clob_rewards = market.get("clobRewards", [{}])[0]  # Get first reward entry if it exists
                market_data = {
                    "featured": market.get("featured", False),
                    "question": market.get("question", ""),
                    "slug": market.get("slug", ""),
                    "conditionId": market.get("conditionId", ""),
                    "id": market.get("id", ""),
                    "createdAt": market.get("createdAt", None),
                    "startDate": market.get("startDate", None),
                    "endDate": market.get("endDate", None),
                    "outcomes": json.dumps(market.get("outcomes", [])),
                    "clobTokenIds": json.dumps(market.get("clobTokenIds", [])),
                    "outcomePrices": json.dumps(market.get("outcomePrices", [])),
                    "liquidity": market.get("liquidity", 0),
                    "volume": market.get("volume", 0),
                    "volume24hr": market.get("volume24hr", 0),
                    "rewardsMinSize": market.get("rewardsMinSize", 0),
                    "rewardsMaxSpread": market.get("rewardsMaxSpread", 0),
                    "spread": market.get("spread", 0),
                    "rewardsDailyRate": clob_rewards.get("rewardsDailyRate", 0),
                    "rewardsStartDate": clob_rewards.get("startDate", None),
                    "rewardsEndDate": clob_rewards.get("endDate", None),
                    "Count": count,
                    "timestamp": datetime.now().isoformat()
                }
                cur.execute(insert_query, market_data)

            conn.commit()
            print("All data inserted successfully.")
            total_time = time.time() - start_time
            print("Total elapsed time: {:.2f} seconds".format(total_time))
            
        except Exception as e:
            print("Error:", e)
        finally:
            if conn:
                cur.close()
                conn.close()
                print("Database connection closed.")
                print("---------------------------------")

        # Sleep for a specified duration before starting the next cycle
        sleep_duration = 3600  # sleep for 1 hour
        time.sleep(sleep_duration)

if __name__ == "__main__":
    main()
