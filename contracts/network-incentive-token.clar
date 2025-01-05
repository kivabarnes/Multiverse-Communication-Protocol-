;; Network Incentive Token Contract

(define-fungible-token multiverse-token)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))

;; Public functions
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ft-mint? multiverse-token amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
    (try! (ft-transfer? multiverse-token amount sender recipient))
    (ok true)
  )
)

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) ERR_NOT_AUTHORIZED)
    (ft-burn? multiverse-token amount owner)
  )
)

;; Read-only functions
(define-read-only (get-balance (account principal))
  (ft-get-balance multiverse-token account)
)

(define-read-only (get-total-supply)
  (ft-get-supply multiverse-token)
)

;; Reward functions
(define-public (reward-channel-creation (recipient principal) (reward-amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ft-mint? multiverse-token reward-amount recipient)
  )
)

(define-public (reward-message-transmission (recipient principal) (reward-amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ft-mint? multiverse-token reward-amount recipient)
  )
)

