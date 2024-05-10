<h2>Database table</h2>
<pre>
  create table users(
    id serial primary key,
    email varchar(100) unique not null,
    username varchar(100) unique not null,
    password text not null
  );
</pre>
