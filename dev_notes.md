# Dev Notes

MVP

* Login
* Auth with Schwab
* One big portfolio bucket
* Set percentages for each stock
* Have some sort of job hook that when called will:
  * Create orders to be approved
  * Execute on approved orders
* Pull/serve data from account in Schwab to know what current status is

- api
  - auth
  - account
  - portfolio
    - :id
      - slices/: Set your targets (honestly should be renamed to targets)
      - /sync: Sync data with Schwab. This should also re-roll the strategies and queue up any orders based on targets
      - /exec: Run any purchase/sell orders through Schwab

DB
- portfolios
- portfolioTargets
- positions
- orders