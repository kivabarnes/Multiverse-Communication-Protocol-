;; Inter-Universe Message NFT Contract

(define-non-fungible-token inter-universe-message uint)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_MESSAGE (err u101))

;; Data variables
(define-data-var last-message-id uint u0)

;; Data maps
(define-map message-data
  uint
  {
    sender-universe: (string-ascii 64),
    recipient-universe: (string-ascii 64),
    content-hash: (buff 32),
    timestamp: uint,
    channel-id: uint
  }
)

;; Public functions
(define-public (mint-message (sender-universe (string-ascii 64)) (recipient-universe (string-ascii 64)) (content-hash (buff 32)) (channel-id uint))
  (let
    (
      (message-id (+ (var-get last-message-id) u1))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (try! (nft-mint? inter-universe-message message-id tx-sender))
    (map-set message-data
      message-id
      {
        sender-universe: sender-universe,
        recipient-universe: recipient-universe,
        content-hash: content-hash,
        timestamp: block-height,
        channel-id: channel-id
      }
    )
    (var-set last-message-id message-id)
    (ok message-id)
  )
)

(define-public (transfer-message (message-id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (unwrap! (nft-get-owner? inter-universe-message message-id) ERR_INVALID_MESSAGE)) ERR_NOT_AUTHORIZED)
    (try! (nft-transfer? inter-universe-message message-id tx-sender recipient))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-message-data (message-id uint))
  (map-get? message-data message-id)
)

(define-read-only (get-message-owner (message-id uint))
  (nft-get-owner? inter-universe-message message-id)
)

(define-read-only (get-last-message-id)
  (var-get last-message-id)
)

