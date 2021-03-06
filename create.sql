drop table signup;
create table signup(
  id integer(10) not null auto_increment primary key,
  first_name varchar(64),
  last_name varchar(64),
  address varchar(64),
  address2 varchar(64),
  city varchar(64),
  state varchar(64),
  zip varchar(64),
  email varchar(64),
  phone varchar(64),
  shirt_size varchar(3),
  bbs_relationship varchar(16),
  bbs_gene varchar(5),
  bbs_birth_year varchar(4),
  bbs_cribbs varchar(16),
  ticket_type varchar(16),
  ticket_cost numeric(10,2),
  registration_amount numeric(10,2),
  donation_amount numeric(10,2),
  total_amount numeric(10,2),
  payment_method varchar(6),
  payment_status varchar(16),
  attendee_of integer(10),
  created_at datetime
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;

create table tshirt(
  id integer(10) not null auto_increment primary key,
  signup_id integer(10) not null,
  size varchar(3) not null,
  quantity integer(10) not null
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;
