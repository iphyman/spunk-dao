from pyteal import *
from pathlib import Path

# A logic signature wallet to hold DAO governance ASA


def governance_token_lsig(GOV_TOKEN_ASA_ID, DAO_APPLICATION_ID):

    def basic_checks(txn: Txn): return And(
        txn.rekey_to() == Global.zero_address(),
        txn.close_remainder_to() == Global.zero_address(),
        txn.asset_close_to() == Global.zero_address()
    )

    opt_in = And(
        basic_checks(Txn),
        Txn.type_enum() == TxnType.AssetTransfer,
        Txn.asset_amount() == Int(0),
        Txn.xfer_asset() == Int(GOV_TOKEN_ASA_ID)
    )

    deposit_or_withdraw = And(
        Global.group_size() == Int(2),

        basic_checks(Gtxn[0]),
        Gtxn[0].type_enum() == TxnType.ApplicationCall,
        Gtxn[0].application_id() == Int(DAO_APPLICATION_ID),
        Or(
            Gtxn[0].application_args[0] == Bytes("add_proposal"),
            Gtxn[0].application_args[0] == Bytes("deposit_vote_token"),
            Gtxn[0].application_args[0] == Bytes("withdraw_vote_deposit"),
            Gtxn[0].application_args[0] == Bytes("clear_proposal"),
        ),

        Txn.group_index() == Int(1),
        basic_checks(Gtxn[1]),
        Gtxn[1].type_enum() == TxnType.AssetTransfer,
        Gtxn[1].xfer_asset() == Int(GOV_TOKEN_ASA_ID),
    )

    program = Cond(
        [Global.group_size() == Int(1), opt_in],
        [Global.group_size() == Int(2), deposit_or_withdraw],
    )

    return program


if __name__ == "__main__":
    governance_token_lsig_path = (
        Path("..") / ".." / "ui" / "src" / "contracts" /
        "governance_token_lsig.teal"
    )
    params = {
        "GOV_TOKEN_ASA_ID": 1200000,
        "DAO_APPLICATION_ID": 9000000
    }

    with governance_token_lsig_path.open("w") as f:
        compiled = compileTeal(governance_token_lsig(
            params["GOV_TOKEN_ASA_ID"], params["DAO_APPLICATION_ID"]), mode=Mode.Application, version=5)
        f.write(compiled)
