import {
    Model,
    Column,
    PrimaryKey,
    Table,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    Unique,
    ForeignKey,
    DataType
} from "sequelize-typescript";

@Table
export default class Electricity extends Model<Electricity> {

    @PrimaryKey
    @Unique
    @AutoIncrement
    @Column
    id!: number;

    @Column
    net_manager!: string;

    @Column
    purchase_area!: string;

    @Column
    street!: string;

    @Column
    zipcode_from!: string;

    @Column
    zipcode_to!: string;

    @Column
    city!: string;

    @Column (DataType.FLOAT)
    delivery_perc!: number;

    @Column  (DataType.FLOAT)
    num_connections!: number;

    @Column (DataType.FLOAT)
    perc_of_active_connections!: number;

    @Column (DataType.FLOAT)
    type_conn_perc?: number;

    @Column
    type_of_connection?: string;

    @Column (DataType.FLOAT)
    annual_consume!: number;

    @Column (DataType.FLOAT)
    annual_consume_lowtarif_perc!: number;

    @Column (DataType.FLOAT)
    smartmeter_perc?: number;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}