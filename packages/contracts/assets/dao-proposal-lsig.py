from pyteal import *
from pathlib import Path

# A logic signature that holds governance token required to make a proposal
# A mininimum amount is set by the DAO creator
# Any member that wishes to create a proposal must deposit at least this
# minimum amount which he can withdraw later when the proposal is inactive


def dao_proposal_lsig(ARG_OWNER, ARG_DAO_APP_ID):

    def basic_owner_checks(txn: Txn): return And(
        txn.rekey_to() == Global.zero_address(),
        txn.sender() == Addr(ARG_OWNER)
    )

    def basic_checks(txn: Txn): return And(
        txn.rekey_to() == Global.zero_address(),
        txn.close_remainder_to() == Global.zero_address(),
        txn.asset_close_to() == Global.zero_address()
    )

    opt_in = And(
        basic_checks(Gtxn[0]),
        basic_checks(Gtxn[1]),
        Gtxn[0].type_enum() == TxnType.Payment,
        Gtxn[0].amount() == Int(0),
        Gtxn[0].sender() == Addr(ARG_OWNER),
        Gtxn[1].type_enum() == TxnType.AssetTransfer,
        Gtxn[1].asset_amount() == Int(0)
    )

    allow_app_call = And(
        Global.group_size() <= Int(2),
        basic_checks(Gtxn[0]),
        Gtxn[0].type_enum() == TxnType.ApplicationCall,
        Gtxn[0].application_id() == Int(ARG_DAO_APP_ID)
    )

    withdraw = And(
        basic_owner_checks(Txn),
        Or(
            Txn.type_enum() == TxnType.AssetTransfer,
            Txn.type_enum() == TxnType.Payment
        )
    )

    deposit = And(
        basic_checks(Gtxn[0]),
        Gtxn[0].type_enum() == TxnType.ApplicationCall,
        Gtxn[0].application_id() == Int(ARG_DAO_APP_ID),

        basic_checks(Gtxn[1]),
        Gtxn[1].type_enum() == TxnType.AssetTransfer,
    )

    program = Cond(
        [Global.group_size() == Int(1), Or(allow_app_call, withdraw)],
        [Global.group_size() == Int(2), Or(allow_app_call, opt_in, deposit)]
    )

    return program


if __name__ == "__main__":
    dao_proposal_path = (
        Path("..") / ".." / "ui" / "src" / "contracts" /
        "dao_proposal.teal"
    )
    params = {
        "ARG_OWNER": "EDXG4GGBEHFLNX6A7FGT3F6Z3TQGIU6WVVJNOXGYLVNTLWDOCEJJ35LWJY",
        "ARG_DAO_APP_ID": 9000000
    }

    with dao_proposal_path.open("w") as f:
        compiled = compileTeal(dao_proposal_lsig(
            params["ARG_OWNER"], params["ARG_DAO_APP_ID"]), mode=Mode.Signature, version=5)
        f.write(compiled)
