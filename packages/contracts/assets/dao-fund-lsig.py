from pyteal import *
from pathlib import Path

# A logic signature to hold DAO funds such as ASA or ALGO


def dao_fund_lsig(DAO_APPLICATION_ID):

    def basic_checks(txn: Txn): return And(
        txn.rekey_to() == Global.zero_address(),
        txn.close_remainder_to() == Global.zero_address(),
        txn.asset_close_to() == Global.zero_address()
    )

    payment = And(
        basic_checks(Gtxn[0]),
        Gtxn[0].type_enum() == TxnType.ApplicationCall,
        Gtxn[0].application_id() == Int(DAO_APPLICATION_ID),
        Gtxn[0].application_args[0] == Bytes("execute"),

        basic_checks(Gtxn[1]),
        Or(
            Gtxn[1].type_enum() == TxnType.AssetTransfer,
            Gtxn[1].type_enum() == TxnType.Payment,
        )
    )

    opt_in = And(
        basic_checks(Txn),
        Txn.type_enum() == TxnType.AssetTransfer,
        Txn.asset_amount() == Int(0)
    )

    program = program = Cond(
        [Global.group_size() == Int(1), opt_in],
        [Global.group_size() == Int(2), payment]
    )

    return program


if __name__ == "__main__":
    spunk_dao_treasury_path = (
        Path("..") / ".." / "ui" / "src" / "contracts" /
        "dao_fund_lsig.teal"
    )
    params = {
        "DAO_APPLICATION_ID": 9000000
    }

    with spunk_dao_treasury_path.open("w") as f:
        compiled = compileTeal(
            dao_fund_lsig(params["DAO_APPLICATION_ID"]), mode=Mode.Signature, version=5)
        f.write(compiled)
